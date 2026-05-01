// Express Request → 도메인이 다루는 평범한 자료구조로 변환하는 어댑터.
// 기존 web/event.ts(APIGatewayProxyEvent용)를 대체한다.
import type { Request } from "express";
import type { UserInfo } from "../domain/Message";

export function getChannelNameAndMessageId(req: Request): { channelName: string; messageId: string | undefined } {
  const channel = (req.params.channel as string | undefined) ?? "default";
  const messageId = req.params.message as string | undefined;
  return { channelName: channel, messageId };
}

export function isApiCall(req: Request): boolean {
  // 기존 동작 유지: User-Agent에 curl 포함 또는 ?response=api
  const userAgent = req.get("user-agent") ?? "";
  const isCurl = userAgent.includes("curl");
  const responseQuery = (req.query.response as string | undefined)?.toLowerCase();
  return isCurl || responseQuery === "api";
}

export function getBody(req: Request): string | null {
  // body-parser의 text() 미들웨어를 통과하면 string, 아니면 빈 객체일 수 있다.
  if (typeof req.body === "string") {
    return req.body.length > 0 ? req.body : null;
  }
  return null;
}

export function getAuthor(req: Request): UserInfo {
  return {
    name: null, // TODO: 이름을 어떻게 받을지 고민해보세요.
    userAgent: req.get("user-agent") ?? null,
    // trust proxy가 켜져있을 때 req.ip가 X-Forwarded-For를 반영함.
    sourceIp: req.ip ?? "unknown",
  };
}
