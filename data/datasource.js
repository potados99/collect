import path from "path";
import {promises as fs} from "fs";

export async function getChannelDataSource(channelName) {
  const channelNameSanitized = channelName.replace(/\//g, '').replace(/\./g, '').trim();
  if (!channelNameSanitized) {
    throw new Error(`Invalid channel name: [${channelName}]`);
  }

  const filePath = path.join('/mnt/storage/channels/', `${channelNameSanitized}.json`);

  await touch(filePath, '[]');

  return filePath;
}

export async function getBackupDataSource() {
  const filePath = path.join('/mnt/storage/', `combined.json`);

  await touch(filePath, '[]');

  return filePath;
}

async function touch(filePath, content = '[]') {
  try {
    await fs.access(filePath);
  } catch (e) {
    await fs.writeFile(filePath, content);
  }
}
