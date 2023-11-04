import getService from "../../domain/service";
import {getChannelNameAndMessageId, isApiCall} from "../event";

export default async function getMessages(event) {
  const {channelName, messageId} = await getChannelNameAndMessageId(event);

  const messages = await getService().getMessages(channelName, messageId);
  if (messages == null) {
    return {
      statusCode: 404,
      body: 'Message not found.'
    };
  }

  if (isApiCall(event)) {
    // 커맨드라인에서 curl로 들어온 요청이거나,
    // response 파라미터가 api인 요청인 경우,
    // application/json으로 내려줍니다.
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messages, null, 4)
    };
  } else {
    // 아닌 경우, 웹 브라우저로 간주하고 text/html로 내려줍니다.
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: `
          <html lang='ko'>
            <head>
              <meta charset='utf-8'>
              <meta name='viewport' content='width=device-width,initial-scale=1'>
              <title>감자도스 수집기</title>
            </head>
            <body>
              <h2>${channelName}</h2>
              
              <pre style='white-space: pre-wrap;'>${JSON.stringify(messages, null, 4)}</pre>
              
              <form onSubmit="fetch('/${channelName}', {method: 'POST', body: document.getElementById('form_content').value}).then(() => window.location.reload()); return false;">
                <input type='text' id='form_content'>
                <input type='submit' value='등록'>
              </form>
              <form onSubmit="fetch('/${channelName}', {method: 'DELETE'}).then(() => window.location.reload()); return false;">
                <input type='submit' value='초기화' style='background: red;'>
              </form>
              
            </body>
          </html>`
    };
  }
}
