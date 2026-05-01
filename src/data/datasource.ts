import path from "path";
import config from "../config";
import HttpError from "../common/HttpError";
import { promises as fs } from "fs";

export async function getChannelDataSource(channelName: string) {
  const channelNameSanitized = channelName.replace(/\//g, "").replace(/\./g, "").trim();
  if (!channelNameSanitized) {
    throw new HttpError(400, `Invalid channel name: [${channelName}]`);
  }

  const filePath = path.join(config.storageDir, "channels", `${channelNameSanitized}.json`);

  await touch(filePath, "[]");

  return filePath;
}

export async function getBackupDataSource() {
  const filePath = path.join(config.storageDir, `combined.json`);

  await touch(filePath, "[]");

  return filePath;
}

async function touch(filePath: string, content: string = "[]") {
  try {
    await fs.access(filePath);
  } catch {
    // 부모 디렉토리가 없으면 만든다 (storageDir이 처음 비어있는 환경 대응).
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content);
  }
}
