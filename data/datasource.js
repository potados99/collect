import path from "path";

export async function getChannelDataSource(channelName) {
  const channelNameSanitized = channelName.replace(/\//g, '').replace(/\./g, '').trim();
  if (!channelNameSanitized) {
    throw new Error(`Invalid channel name: [${channelName}]`);
  }

  const filePath = path.join('/mnt/storage/channels/', `${channelNameSanitized}.json`);

  // 파일이 없으면 생성합니다.
  try {
    await fs.access(filePath);
  } catch (e) {
    await fs.writeFile(filePath, '[]');
  }

  return filePath;
}

export async function getBackupDataSource() {
  const filePath = path.join('/mnt/storage/', `combined.json`);

  // 파일이 없으면 생성합니다.
  try {
    await fs.access(filePath);
  } catch (e) {
    await fs.writeFile(filePath, '[]');
  }

  return filePath;
}
