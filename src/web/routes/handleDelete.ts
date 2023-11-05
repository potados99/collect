import getService from "../../domain/service";
import { jsonResponse } from "../response";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getChannelNameAndMessageId } from "../event";

export default async function handleDelete(event: APIGatewayProxyEvent) {
  const { channelName } = await getChannelNameAndMessageId(event);

  await getService().deleteMessages(channelName);

  return jsonResponse({
    message: "굿",
  });
}
