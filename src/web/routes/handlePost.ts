import getService from "../../domain/service";
import { getBody, getChannelNameAndMessageId, getMetadata } from "../event";
import { APIGatewayProxyEvent } from "aws-lambda";
import HttpError from "../../common/HttpError";

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

  return {
    statusCode: 200,
    body: "굿\n",
  };
}
