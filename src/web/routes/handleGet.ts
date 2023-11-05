import getService from "../../domain/service";
import { getChannelNameAndMessageId, isApiCall } from "../event";
import { APIGatewayProxyEvent } from "aws-lambda";
import { htmlResponse, jsonResponse } from "../response";
import HttpError from "../../common/HttpError";

export default async function handleGet(event: APIGatewayProxyEvent) {
  const { channelName, messageId } = await getChannelNameAndMessageId(event);
  const apiCall = isApiCall(event);

  if (messageId == null) {
    return await getAllMessages(channelName, apiCall);
  } else {
    return await getMessage(channelName, messageId, apiCall);
  }
}

async function getAllMessages(channelName: string, apiCall: boolean) {
  const messages = await getService().getAllMessages(channelName);

  if (apiCall) {
    return jsonResponse(messages);
  } else {
    return htmlResponse("messages", { channelName, messages });
  }
}

async function getMessage(channelName: string, messageId: string, apiCall: boolean) {
  const message = await getService().getMessage(channelName, messageId);
  if (message == null) {
    throw new HttpError(404, "Message not found.");
  }

  if (apiCall) {
    return jsonResponse(message);
  } else {
    return htmlResponse("message", { channelName, message });
  }
}
