import HttpError from "../../common/HttpError";
import getService from "../../domain/service";
import { jsonResponse } from "../response";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getAuthor, getBody, getChannelNameAndMessageId } from "../event";

export default async function handlePost(event: APIGatewayProxyEvent) {
  const content = getBody(event);
  if (content == null) {
    throw new HttpError(400, "Empty body");
  }

  const { channelName } = await getChannelNameAndMessageId(event);
  const author = getAuthor(event);

  const { channel, id } = await getService().addMessage(channelName, content, author);

  return jsonResponse({
    message: "굿",
    url: `https://collect.potados.com/${channel}/${id}`,
  });
}
