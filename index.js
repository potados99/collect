import handleGet from "./web/routes/handleGet.js";
import handlePost from "./web/routes/handlePost.js";
import handleDelete from "./web/routes/handleDelete.js";
import {getMethod} from "./web/event";

export async function getRoute(event) {
  const routes = {
    get: handleGet,
    post: handlePost,
    delete: handleDelete
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
