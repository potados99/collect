import type { Request, Response } from "express";
import HttpError from "../../common/HttpError";
import getService from "../../domain/service";
import { htmlResponse, jsonResponse } from "../response";
import { getChannelNameAndMessageId, isApiCall } from "../request";

export default async function handleGet(req: Request, res: Response): Promise<void> {
  const { channelName, messageId } = getChannelNameAndMessageId(req);
  const apiCall = isApiCall(req);

  if (messageId == null) {
    await getAllMessages(res, channelName, apiCall);
  } else {
    await getMessage(res, channelName, messageId, apiCall);
  }
}

async function getAllMessages(res: Response, channelName: string, apiCall: boolean) {
  const messages = await getService().getAllMessages(channelName);
  const messagesResponses = messages.map((message) => message.toResponse());

  if (apiCall) {
    jsonResponse(res, messagesResponses);
  } else {
    htmlResponse(res, "messages", { channelName, messages: messagesResponses });
  }
}

async function getMessage(res: Response, channelName: string, messageId: string, apiCall: boolean) {
  const message = await getService().getMessage(channelName, messageId);
  if (message == null) {
    throw new HttpError(404, "Message not found.");
  }

  const messageResponse = message.toResponse();

  if (apiCall) {
    jsonResponse(res, messageResponse);
  } else {
    htmlResponse(res, "message", { channelName, messages: messageResponse });
  }
}
