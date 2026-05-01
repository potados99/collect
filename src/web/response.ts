// Express Response 헬퍼. 라우트 핸들러는 이 함수들로만 응답을 보낸다.
import pug from "pug";
import path from "path";
import type { Response } from "express";

// 컴파일된 pug 템플릿 캐시: 매 요청마다 디스크에서 다시 컴파일하지 않도록.
const templateCache: Record<string, pug.compileTemplate> = {};

function compileTemplate(template: string): pug.compileTemplate {
  if (templateCache[template]) return templateCache[template];

  const templatePath = path.join(__dirname, "views", `${template}.pug`);
  const compiled = pug.compileFile(templatePath);
  templateCache[template] = compiled;
  return compiled;
}

export function htmlResponse(res: Response, template: string, data: unknown): void {
  const compiled = compileTemplate(template);
  res
    .status(200)
    .type("text/html")
    .send(compiled(data as object));
}

export function jsonResponse(res: Response, data: unknown): void {
  // 기존 Lambda 응답 포맷과 동일하게 4-space pretty JSON 유지 (호환성)
  res
    .status(200)
    .type("application/json")
    .send(JSON.stringify(data, null, 4));
}

export function errorResponse(res: Response, statusCode: number, message: string): void {
  res.status(statusCode).type("text/plain").send(message);
}
