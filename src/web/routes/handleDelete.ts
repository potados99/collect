import type { Request, Response } from "express";
import getService from "../../domain/service";
import { jsonResponse } from "../response";
import { getAuthor, getChannelNameAndMessageId } from "../request";
import type { UserInfo } from "../../domain/Message";

export default async function handleDelete(req: Request, res: Response): Promise<void> {
  const { channelName, messageId } = getChannelNameAndMessageId(req);
  const author = getAuthor(req);

  if (messageId == null) {
    await deleteAllMessages(res, channelName, author);
  } else {
    await deleteMessage(res, channelName, messageId, author);
  }
}

async function deleteAllMessages(res: Response, channelName: string, author: UserInfo) {
  await getService().deleteAllMessages(channelName, author);
  jsonResponse(res, { message: "굿" });
}

async function deleteMessage(res: Response, channelName: string, messageId: string, author: UserInfo) {
  await getService().deleteMessage(channelName, messageId, author);
  jsonResponse(res, { message: "굿" });
}
