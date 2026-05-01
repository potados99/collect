import type { Request, Response } from "express";
import HttpError from "../../common/HttpError";
import getService from "../../domain/service";
import { jsonResponse } from "../response";
import { getAuthor, getBody, getChannelNameAndMessageId } from "../request";

export default async function handlePatch(req: Request, res: Response): Promise<void> {
  const content = getBody(req);
  if (content == null) {
    throw new HttpError(400, "Empty body");
  }

  const { channelName, messageId } = getChannelNameAndMessageId(req);
  if (messageId == null) {
    throw new HttpError(400, "Message ID is required");
  }

  const author = getAuthor(req);

  await getService().updateMessage(channelName, messageId, content, author);

  jsonResponse(res, { message: "굿" });
}
