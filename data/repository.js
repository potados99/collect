import {randomUUID} from "crypto";
import {promises as fs} from "fs";
import {getBackupDataSource, getChannelDataSource} from "./datasource";

export async function getChannelRepository(channelName) {
  return await getRepository(await getChannelDataSource(channelName));
}

export async function getBackupRepository() {
  return await getRepository(await getBackupDataSource());
}

async function getRepository(dataSource) {
  const file = dataSource;

  return {
    getAllMessages: async function() {
      const fileContents = await fs.readFile(file);

      return JSON.parse(fileContents);
    },

    getMessage: async function(messageId) {
      const allMessages = await this.getAllMessages();

      if (['last', 'latest'].includes(messageId.toLowerCase())) {
        // 가장 마지막(최근) 것을 줍니다.
        return allMessages.pop();
      }

      return allMessages.filter(message => message.id === messageId).pop();
    },

    addMessage: async function({channelName, timeEpoch, userAgent, sourceIp, content}) {
      const allMessages = await this.getAllMessages();
      const newMessage = {
        id: randomUUID(),
        channel: channelName,
        timestamp: timeEpoch,
        date: new Date(timeEpoch).toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'}),
        userAgent,
        sourceIp,
        body: content
      };

      allMessages.push(newMessage);

      await fs.writeFile(file, JSON.stringify(allMessages, null, 4));
    },

    deleteAllMessages: async function() {
      await fs.writeFile(file, '[]');
    }
  };
}
