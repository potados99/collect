import { Message } from "../domain/types";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { AddMessageParams } from "../domain/service";
import { getBackupDataSource, getChannelDataSource } from "./datasource";

export default async function getRepository(channelName: string) {
  return createRepositoryWithDataSources(
    await getChannelDataSource(channelName), // 채널마다 하나씩 있는 데이터 소스(파일)
    await getBackupDataSource() // 모든 채널의 메시지가 다 저장되는 백업용 데이터 소스(파일)
  );
}

function createRepositoryWithDataSources(primaryDataSource: string, backupDataSource: string) {
  return {
    getAllMessages: async function () {
      const fileContent = await fs.readFile(primaryDataSource).then((buffer) => buffer.toString());

      return JSON.parse(fileContent) as Message[];
    },

    getMessage: async function (messageId: string) {
      const allMessages = await this.getAllMessages();

      if (["last", "latest"].includes(messageId.toLowerCase())) {
        // 가장 마지막(최근) 것을 줍니다.
        return allMessages.pop() as Message;
      }

      return allMessages.filter((message) => message.id === messageId).pop() as Message;
    },

    addMessage: async function ({ channelName, timeEpoch, userAgent, sourceIp, content }: AddMessageParams) {
      const allMessages = await this.getAllMessages();
      const newMessage: Message = {
        id: randomUUID(),
        channel: channelName,
        timestamp: timeEpoch,
        date: new Date(timeEpoch).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
        userAgent,
        sourceIp,
        body: content,
      };

      allMessages.push(newMessage);

      const fileContent = JSON.stringify(allMessages, null, 4);

      await fs.writeFile(primaryDataSource, fileContent);
      await fs.writeFile(backupDataSource, fileContent);
    },

    deleteAllMessages: async function () {
      await fs.writeFile(primaryDataSource, "[]");
    },
  };
}
