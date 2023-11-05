import pug from 'pug';
import path from "path";

const pugPath = 'web/views';

export function htmlResponse(template, data) {
  const templatePath = path.join(pugPath, template);

  const compiled = pug.compileFile(templatePath);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: compiled(data)
  }
}

export function jsonResponse(data) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data, null, 4)
  };
}

export function errorResponse(statusCode, message) {
  return {
    statusCode,
    body: message
  };

}
