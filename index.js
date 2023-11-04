import getMessages from "./web/routes/getMessages";
import postMessage from "./web/routes/postMessage";
import deleteMessages from "./web/routes/deleteMessages";
import {getMethod} from "./web/event";

export async function getRoute(event) {
  const routes = {
    get: getMessages,
    post: postMessage,
    delete: deleteMessages
  };

  const method = getMethod(event);

  const route = routes[method];
  if (route == null) {
    throw new Error(`Unknown method: [${method}]`);
  }

  return route;
}

export const handler = async (event) => {
  const route = await getRoute(event);

  return route(event);
};
