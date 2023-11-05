import pug from "pug";
import path from "path";

export function htmlResponse(template: string, data: any) {
  console.log(__dirname);
  const templatePath = path.join(__dirname, "views", `${template}.pug`);

  const compiled = pug.compileFile(templatePath);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: compiled(data),
  };
}

export function jsonResponse(data: any) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data, null, 4),
  };
}

export function errorResponse(statusCode: number, message: string) {
  return {
    statusCode,
    body: message,
  };
}
