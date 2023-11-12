import getService from "../../domain/service";
import { jsonResponse } from "../response";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getAuthor, getChannelNameAndMessageId } from "../event";
import { UserInfo } from "../../domain/Message";

export default async function handleDelete(event: APIGatewayProxyEvent) {
  const { channelName, messageId } = await getChannelNameAndMessageId(event);

  const author = getAuthor(event);

  if (messageId == null) {
    return await deleteAllMessages(channelName, author);
  } else {
    return await deleteMessage(channelName, messageId, author);
  }
}

async function deleteAllMessages(channelName: string, author: UserInfo) {
  await getService().deleteAllMessages(channelName, author);

  return jsonResponse({
    message: "굿",
  });
}

async function deleteMessage(channelName: string, messageId: string, author: UserInfo) {
  await getService().deleteMessage(channelName, messageId, author);

  return jsonResponse({
    message: "굿",
  });
}
