import HttpError from "../../common/HttpError";
import getService from "../../domain/service";
import { APIGatewayProxyEvent } from "aws-lambda";
import { htmlResponse, jsonResponse } from "../response";
import { getChannelNameAndMessageId, isApiCall } from "../event";

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
  const messagesResponses = messages.map((message) => message.toResponse());

  if (apiCall) {
    return jsonResponse(messagesResponses);
  } else {
    return htmlResponse("messages", { channelName, messages: messagesResponses });
  }
}

async function getMessage(channelName: string, messageId: string, apiCall: boolean) {
  const message = await getService().getMessage(channelName, messageId);
  if (message == null) {
    throw new HttpError(404, "Message not found.");
  }

  const messageResponse = message.toResponse();

  if (apiCall) {
    return jsonResponse(messageResponse);
  } else {
    return htmlResponse("message", { channelName, messages: messageResponse });
  }
}
