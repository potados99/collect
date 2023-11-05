import getRepository from "../data/repository";

export type AddMessageParams = {
  channelName: string;
  timeEpoch: number;
  userAgent: string | null;
  sourceIp: string;
  content: string;
};

export default function getService() {
  return createService();
}

function createService() {
  return {
    getMessage: async function (channelName: string, messageId: string) {
      const repo = await getRepository(channelName);

      return await repo.getMessage(messageId);
    },

    getAllMessages: async function (channelName: string) {
      const repo = await getRepository(channelName);

      return await repo.getAllMessages();
    },

    addMessage: async function ({ channelName, ...params }: AddMessageParams) {
      const repo = await getRepository(channelName);

      const message = {
        channelName,
        ...params,
      };

      await repo.addMessage(message);
    },

    deleteMessages: async function (channelName: string) {
      const repo = await getRepository(channelName);

      await repo.deleteAllMessages();
    },
  };
}
