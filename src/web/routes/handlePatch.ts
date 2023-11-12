import HttpError from "../../common/HttpError";
import getService from "../../domain/service";
import { jsonResponse } from "../response";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getAuthor, getBody, getChannelNameAndMessageId } from "../event";

export default async function handlePatch(event: APIGatewayProxyEvent) {
  const content = getBody(event);
  if (content == null) {
    throw new HttpError(400, "Empty body");
  }

  const { channelName, messageId } = await getChannelNameAndMessageId(event);
  if (messageId == null) {
    throw new HttpError(400, "Message ID is required");
  }

  const author = getAuthor(event);

  await getService().updateMessage(channelName, messageId, content, author);

  return jsonResponse({
    message: "굿",
  });
}
