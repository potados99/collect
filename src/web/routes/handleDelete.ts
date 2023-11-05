import getService from '../../domain/service';
import { getChannelNameAndMessageId } from '../event';
import { APIGatewayProxyEvent } from 'aws-lambda';

export default async function handleDelete(event: APIGatewayProxyEvent) {
    const { channelName } = await getChannelNameAndMessageId(event);

    await getService().deleteMessages(channelName);

    return {
        statusCode: 200,
        body: '굿\n',
    };
}
