// 실제 Express app을 띄우고 supertest로 두드리는 e2e 테스트.
// 데이터는 OS tmp 디렉토리에 격리되어 테스트마다 깨끗한 상태에서 시작한다.
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import request from "supertest";

let storageDir: string;

beforeAll(async () => {
  storageDir = await fs.mkdtemp(path.join(os.tmpdir(), "collect-test-"));
  process.env.STORAGE_DIR = storageDir;
  process.env.PUBLIC_BASE_URL = "https://collect.test";
});

afterAll(async () => {
  await fs.rm(storageDir, { recursive: true, force: true });
});

// createApp은 config 모듈을 require할 때 환경변수를 읽으므로 env 셋업 후에 require해야 한다.
function loadApp() {
  jest.resetModules();
  const { createApp } = require("../../src/index");
  return createApp();
}

describe("collect e2e", () => {
  it("헬스체크가 ok를 응답한다", async () => {
    const res = await request(loadApp()).get("/_health");
    expect(res.status).toBe(200);
    expect(res.text).toBe("ok");
  });

  it("빈 채널의 메시지 목록은 빈 배열이다 (api)", async () => {
    const res = await request(loadApp()).get("/somechannel?response=api");
    expect(res.status).toBe(200);
    const body = JSON.parse(res.text);
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(0);
  });

  it("POST하면 메시지가 추가되고 GET으로 조회된다 (default 채널)", async () => {
    const app = loadApp();
    const post = await request(app).post("/").set("user-agent", "curl/8.0").send("안녕세상");
    expect(post.status).toBe(200);
    const posted = JSON.parse(post.text);
    expect(posted.message).toBe("굿");
    expect(posted.url).toContain("/default/");

    const id = posted.url.split("/").pop();

    const get = await request(app).get(`/default/${id}?response=api`);
    expect(get.status).toBe(200);
    const got = JSON.parse(get.text);
    expect(got.body).toBe("안녕세상");
    expect(got.id).toBe(id);
    expect(got.channel).toBe("default");
  });

  it("PATCH로 본문을 수정하면 lastCommit이 patch 타입이 된다", async () => {
    const app = loadApp();
    const post = await request(app).post("/edit-channel").set("user-agent", "curl/8.0").send("first");
    const id = JSON.parse(post.text).url.split("/").pop();

    const patch = await request(app).patch(`/edit-channel/${id}`).set("user-agent", "curl/8.0").send("second");
    expect(patch.status).toBe(200);

    const get = await request(app).get(`/edit-channel/${id}?response=api`);
    const got = JSON.parse(get.text);
    expect(got.body).toBe("second");
    expect(got.commits[got.commits.length - 1].type).toBe("patch");
  });

  it("DELETE 단일 메시지 후 목록에서 제외된다", async () => {
    const app = loadApp();
    const post = await request(app).post("/del-channel").set("user-agent", "curl/8.0").send("bye");
    const id = JSON.parse(post.text).url.split("/").pop();

    const del = await request(app).delete(`/del-channel/${id}`).set("user-agent", "curl/8.0");
    expect(del.status).toBe(200);

    const list = await request(app).get("/del-channel?response=api");
    const items = JSON.parse(list.text);
    expect(items).toHaveLength(0);
  });

  it("빈 본문으로 POST하면 400을 반환한다", async () => {
    const res = await request(loadApp()).post("/").set("user-agent", "curl/8.0").send("");
    expect(res.status).toBe(400);
  });

  it("HTML 응답은 user-agent에 curl이 없을 때 (브라우저)", async () => {
    const app = loadApp();
    await request(app).post("/html-channel").set("user-agent", "curl/8.0").send("hello");
    const res = await request(app).get("/html-channel").set("user-agent", "Mozilla/5.0");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
    expect(res.text).toContain("html");
  });

  it("일반 요청에 CORS 허용 헤더가 붙는다", async () => {
    const res = await request(loadApp()).get("/_health").set("Origin", "https://feed.potados.com");
    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe("*");
  });

  it("preflight(OPTIONS)가 메서드/헤더를 허용한다", async () => {
    const res = await request(loadApp())
      .options("/somechannel")
      .set("Origin", "https://feed.potados.com")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "content-type");
    expect([200, 204]).toContain(res.status);
    expect(res.headers["access-control-allow-origin"]).toBe("*");
    expect(res.headers["access-control-allow-methods"]).toMatch(/POST/);
  });
});
