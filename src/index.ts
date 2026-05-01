// Express 진입점.
// 라우팅: GET/POST/PATCH/DELETE 모두 channel과 message가 옵셔널이라 단일 어댑터로 받는다.
import express, { type NextFunction, type Request, type Response } from "express";
import config from "./config";
import HttpError from "./common/HttpError";
import handleGet from "./web/routes/handleGet";
import handlePost from "./web/routes/handlePost";
import handlePatch from "./web/routes/handlePatch";
import handleDelete from "./web/routes/handleDelete";
import { errorResponse } from "./web/response";

export function createApp() {
  const app = express();

  // X-Forwarded-* 신뢰: Caddy 등 reverse proxy 뒤에서 req.ip가 실제 클라이언트 IP가 되도록.
  app.set("trust proxy", config.trustProxy);

  // 모든 본문을 평문 텍스트로 받는다 (도메인이 임의의 텍스트를 다루기 때문).
  // limit 1MB는 텍스트 수집기 사용 패턴을 고려한 보수적 한도.
  app.use(express.text({ type: "*/*", limit: "1mb" }));

  // 헬스체크
  app.get("/_health", (_req, res) => {
    res.status(200).type("text/plain").send("ok");
  });

  // 메서드별 어댑터를 동일한 세 패턴 위에 얹는다.
  const paths = ["/", "/:channel", "/:channel/:message"];
  const wrap =
    (handler: (req: Request, res: Response) => Promise<void>) => (req: Request, res: Response, next: NextFunction) =>
      handler(req, res).catch(next);

  app.get(paths, wrap(handleGet));
  app.post(paths, wrap(handlePost));
  app.patch(paths, wrap(handlePatch));
  app.delete(paths, wrap(handleDelete));

  // 에러 핸들러는 라우트 등록 이후, 4-arity로 선언해야 Express가 인식한다.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    if (err instanceof HttpError) {
      errorResponse(res, err.statusCode, err.message);
    } else if (err instanceof Error) {
      errorResponse(res, 500, err.message);
    } else {
      errorResponse(res, 500, "Something very weird happened.");
    }
  });

  return app;
}

// 직접 실행 시에만 listen — 테스트는 createApp()을 import해서 supertest로 사용.
if (require.main === module) {
  const app = createApp();
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`collect listening on :${config.port} (storageDir=${config.storageDir})`);
  });
}
