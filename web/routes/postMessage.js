import getService from "../../domain/service";
import {getBody, getChannelNameAndMessageId, getMetadata} from "../event";

export default async function postMessage(event) {
  const {channelName} = await getChannelNameAndMessageId(event);
  const content = await getBody(event);
  const metadata = getMetadata(event);

  await getService().addMessage(channelName, content, metadata);

  return {
    statusCode: 200,
    body: '굿\n'
  };
}
