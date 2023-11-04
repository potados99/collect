export async function getChannelNameAndMessageId(event) {
  const {pathParameters} = event;

  if (pathParameters == null) {
    // 최상위 경로(/)로 들어오면 pathParameters가 없습니다.
    return {
      channelName: 'default',
      messageId: undefined
    };
  }

  const {channel, message} = pathParameters;

  return {
    channelName: channel,
    messageId: message
  };
}

export function isApiCall(event) {
  const {userAgent, queryStringParameters} = event;

  const isCurl = userAgent.includes('curl');
  const isApiCall = queryStringParameters?.response?.toLowerCase() === 'api';

  return isCurl || isApiCall;
}

export function getBody(event) {
  const {isBase64Encoded, body} = event;

  return isBase64Encoded ? Buffer.from(body, 'base64').toString('utf8') : body;
}

export function getMetadata(event) {
  const {
    requestContext: {timeEpoch, http: {userAgent, sourceIp}}
  } = event;

  return {
    timeEpoch,
    userAgent,
    sourceIp
  };
}

export function getMethod(event) {
  const {
    requestContext: {http: {method}}
  } = event;

  return method.toLowerCase();
}
