import getService from "../../domain/service";
import {getChannelNameAndMessageId, isApiCall} from "../event";
import {errorResponse, htmlResponse, jsonResponse} from "../response.js";

export default async function handleGet(event) {
  const {channelName, messageId} = await getChannelNameAndMessageId(event);
  const apiCall = isApiCall(event);

  if (messageId == null) {
    return await getAllMessages(channelName, apiCall);
  } else {
    return await getMessage(channelName, messageId, apiCall);
  }
}

async function getAllMessages(channelName, apiCall) {
  const messages = await getService().getAllMessages(channelName);

  if (apiCall) {
    return jsonResponse(messages);
  } else {
    return htmlResponse('messages', {channelName, messages});
  }
}

async function getMessage(channelName, messageId, apiCall) {
  const message = await getService().getMessage(channelName, messageId);
  if (message == null) {
    return errorResponse(404, 'Message not found.');
  }

  if (apiCall) {
    return jsonResponse(message);
  } else {
    return htmlResponse('message', {channelName, message});
  }
}
