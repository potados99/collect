import getService from "../../domain/service";
import {getChannelNameAndMessageId} from "../event";

export default async function deleteMessages(event) {
  const {channelName} = await getChannelNameAndMessageId(event);

  await getService().deleteMessages(channelName);

  return {
    statusCode: 200,
    body: '굿\n'
  };
}
