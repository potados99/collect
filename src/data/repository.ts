import { promises as fs } from "fs";
import { getChannelDataSource } from "./datasource";
import Message, { UserInfo } from "../domain/Message";

export default async function getRepository(channelName: string) {
  return createRepository(
    channelName,
    await getChannelDataSource(channelName) // 채널마다 하나씩 있는 데이터 소스(파일)
  );
}

function createRepository(channelName: string, dataSource: string) {
  let messages: Message[] = [];

  async function load() {
    const fileContent = await fs.readFile(dataSource).then((buffer) => buffer.toString());

    const parsed = JSON.parse(fileContent) as any[];

    messages = parsed.map((obj) => Message.fromJson(obj));
  }

  async function save() {
    const fileContent = JSON.stringify(messages, null, 4);

    await fs.writeFile(dataSource, fileContent);
  }

  return {
    addMessage: async function (body: string, author: UserInfo) {
      await load();

      const newMessage = Message.fromNewRequest(channelName, body, author);

      messages.push(newMessage);

      await save();

      return newMessage;
    },

    getMessage: async function (messageId: string) {
      await load();

      if (["last", "latest"].includes(messageId.toLowerCase())) {
        // 가장 마지막(최근) 것을 줍니다.
        return messages.pop();
      }

      return messages.filter((message) => message.id === messageId).pop();
    },

    getAllMessages: async function () {
      await load();

      return messages.filter((message) => !message.isDeleted);
    },

    updateMessage: async function (messageId: string, body: string, author: UserInfo) {
      await load();

      const message = messages.filter((message) => message.id === messageId).pop();
      if (!message) {
        throw new Error("메시지를 찾을 수 없습니다.");
      }

      message.update(body, author);

      await save();
    },

    deleteMessage: async function (messageId: string, author: UserInfo) {
      await load();

      const message = messages.filter((message) => message.id === messageId).pop();
      if (!message) {
        throw new Error("메시지를 찾을 수 없습니다.");
      }

      message.delete(author);

      await save();
    },

    deleteAllMessages: async function (author: UserInfo) {
      await load();

      for (const message of messages) {
        message.delete(author);
      }

      await save();
    },
  };
}
