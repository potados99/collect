import getRepository from "../data/repository";

export default function getService() {
  return createService();
}

function createService() {
  return {
    getMessage: async function (channelName, messageId) {
      const repo = await getRepository(channelName);

      return await repo.getMessage(messageId);
    },

    getAllMessages: async function (channelName, messageId) {
      const repo = await getRepository(channelName);

      return await repo.getAllMessages();
    },

    addMessage: async function (channelName, content, metadata) {
      const {timeEpoch, userAgent, sourceIp} = metadata;

      const repo = await getRepository(channelName);

      const message = {
        channelName,
        timeEpoch,
        userAgent,
        sourceIp,
        content
      };

      await repo.addMessage(message);
    },

    deleteMessages: async function (channelName) {
      const repo = await getRepository(channelName);

      await repo.deleteAllMessages();
    }
  };
}
