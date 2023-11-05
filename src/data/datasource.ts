import path from "path";
import { promises as fs } from "fs";
import config from "../config";
import HttpError from "../common/HttpError";

const basePath = config.storageDir;

export async function getChannelDataSource(channelName: string) {
  const channelNameSanitized = channelName.replace(/\//g, "").replace(/\./g, "").trim();
  if (!channelNameSanitized) {
    throw new HttpError(400, `Invalid channel name: [${channelName}]`);
  }

  const filePath = path.join(basePath, "channels", `${channelNameSanitized}.json`);

  await touch(filePath, "[]");

  return filePath;
}

export async function getBackupDataSource() {
  const filePath = path.join(basePath, `combined.json`);

  await touch(filePath, "[]");

  return filePath;
}

async function touch(filePath: string, content: string = "[]") {
  try {
    await fs.access(filePath);
  } catch (e) {
    await fs.writeFile(filePath, content);
  }
}
