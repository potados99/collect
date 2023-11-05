import HttpError from "../../common/HttpError";
import getService from "../../domain/service";
import { jsonResponse } from "../response";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getBody, getChannelNameAndMessageId, getMetadata } from "../event";

export default async function handlePost(event: APIGatewayProxyEvent) {
  const content = getBody(event);
  if (content == null) {
    throw new HttpError(400, "Empty body");
  }

  const { channelName } = await getChannelNameAndMessageId(event);
  const metadata = getMetadata(event);

  await getService().addMessage({
    channelName,
    content,
    ...metadata,
  });

  return jsonResponse({
    message: "굿",
  });
}
