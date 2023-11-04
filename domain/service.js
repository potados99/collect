import {getBackupRepository, getChannelRepository} from "../data/repository";
import {getBody, getMetadata} from "../web/event";

export default function getService() {
  return {
    getMessages: async function (channelName, messageId) {
      const storage = await getChannelRepository(channelName);

      return messageId == null ? await storage.getAllMessages() : await storage.getMessage(messageId);
    },

    addMessage: async function (channelName, content, metadata) {
      const {timeEpoch, userAgent, sourceIp} = metadata;

      const storage = await getChannelRepository(channelName);
      const backupStorage = await getBackupRepository();

      const message = {
        channelName,
        timeEpoch,
        userAgent,
        sourceIp,
        content
      };

      await storage.addMessage(message);
      await backupStorage.addMessage(message);
    },

    deleteMessages: async function (channelName) {
      const storage = await getChannelRepository(channelName);

      await storage.deleteAllMessages();
    }
  };
}
