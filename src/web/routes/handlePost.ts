import type { Request, Response } from "express";
import HttpError from "../../common/HttpError";
import getService from "../../domain/service";
import { jsonResponse } from "../response";
import { getAuthor, getBody, getChannelNameAndMessageId } from "../request";
import config from "../../config";

export default async function handlePost(req: Request, res: Response): Promise<void> {
  const content = getBody(req);
  if (content == null) {
    throw new HttpError(400, "Empty body");
  }

  const { channelName } = getChannelNameAndMessageId(req);
  const author = getAuthor(req);

  const { channel, id } = await getService().addMessage(channelName, content, author);

  jsonResponse(res, {
    message: "굿",
    url: `${config.publicBaseUrl}/${channel}/${id}`,
  });
}
