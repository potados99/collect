export async function getChannelNameAndMessageId(pathParameters) {
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
