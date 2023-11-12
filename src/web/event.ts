import { APIGatewayProxyEvent } from "aws-lambda";
import { UserInfo } from "../domain/Message";

export async function getChannelNameAndMessageId(event: APIGatewayProxyEvent) {
  const { pathParameters } = event;

  if (pathParameters == null) {
    // 최상위 경로(/)로 들어오면 pathParameters가 없습니다.
    return {
      channelName: "default",
      messageId: undefined,
    };
  }

  const { channel, message } = pathParameters;

  return {
    channelName: channel ?? "default",
    messageId: message,
  };
}

export function isApiCall(event: APIGatewayProxyEvent) {
  const {
    requestContext: {
      identity: { userAgent },
    },
    queryStringParameters,
  } = event;

  const isCurl = userAgent != null && userAgent.includes("curl");
  const isApiCall = queryStringParameters?.response?.toLowerCase() === "api";

  return isCurl || isApiCall;
}

export function getBody(event: APIGatewayProxyEvent) {
  const { isBase64Encoded, body } = event;

  return isBase64Encoded ? Buffer.from(body || "", "base64").toString("utf8") : body;
}

export function getMetadata(event: APIGatewayProxyEvent) {
  const {
    requestContext: {
      requestTimeEpoch,
      identity: { userAgent, sourceIp },
    },
  } = event;

  return {
    timeEpoch: requestTimeEpoch,
    userAgent,
    sourceIp,
  };
}

export function getAuthor(event: APIGatewayProxyEvent): UserInfo {
  const { userAgent, sourceIp } = getMetadata(event);

  return {
    name: null, // TODO: 이름을 어떻게 받을지 고민해보세요.
    userAgent,
    sourceIp,
  };
}

const supportedMethods = ["get", "post", "patch", "delete"] as const;

export function getMethod(event: APIGatewayProxyEvent): (typeof supportedMethods)[number] {
  const { httpMethod } = event;
  const normalized = httpMethod.toLowerCase();

  const method = supportedMethods.find((m) => m === normalized);
  if (method == null) {
    throw new Error(`Unsupported method: ${httpMethod}`);
  }

  return method;
}
