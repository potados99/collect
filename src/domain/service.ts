import getRepository from "../data/repository";
import { UserInfo } from "./Message";

export default function getService() {
  return createService();
}

function createService() {
  return {
    addMessage: async function (channelName: string, content: string, author: UserInfo) {
      const repo = await getRepository(channelName);

      await repo.addMessage(content, author);
    },

    getMessage: async function (channelName: string, messageId: string) {
      const repo = await getRepository(channelName);

      return await repo.getMessage(messageId);
    },

    getAllMessages: async function (channelName: string) {
      const repo = await getRepository(channelName);

      return await repo.getAllMessages();
    },

    updateMessage: async function (channelName: string, messageId: string, body: string, author: UserInfo) {
      const repo = await getRepository(channelName);

      await repo.updateMessage(messageId, body, author);
    },

    deleteMessage: async function (channelName: string, messageId: string, author: UserInfo) {
      const repo = await getRepository(channelName);

      await repo.deleteMessage(messageId, author);
    },

    deleteAllMessages: async function (channelName: string, author: UserInfo) {
      const repo = await getRepository(channelName);

      await repo.deleteAllMessages(author);
    },
  };
}
