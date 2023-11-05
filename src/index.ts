import handleGet from "./web/routes/handleGet";
import handlePost from "./web/routes/handlePost";
import handleDelete from "./web/routes/handleDelete";
import { getMethod } from "./web/event";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import HttpError from "./common/HttpError";
import { errorResponse } from "./web/response";

export async function getRoute(event: APIGatewayProxyEvent) {
  const routes = {
    get: handleGet,
    post: handlePost,
    delete: handleDelete,
  };

  const method = getMethod(event);

  const route = routes[method];
  if (route == null) {
    throw new HttpError(400, `Unknown method: [${method}]`);
  }

  return route;
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const route = await getRoute(event);

    return await route(event);
  } catch (err) {
    console.error(err);

    if (err instanceof HttpError) {
      return errorResponse(err.statusCode, err.message);
    } else if (err instanceof Error) {
      return errorResponse(500, err.message);
    } else {
      return errorResponse(500, "Something very weird happened.");
    }
  }
};
