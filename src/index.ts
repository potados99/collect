import handleGet from "./web/routes/handleGet";
import handlePost from "./web/routes/handlePost";
import handleDelete from "./web/routes/handleDelete";
import { getMethod } from "./web/event";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getRoute(event: APIGatewayProxyEvent) {
  const routes = {
    get: handleGet,
    post: handlePost,
    delete: handleDelete,
  };

  const method = getMethod(event);

  const route = routes[method];
  if (route == null) {
    throw new Error(`Unknown method: [${method}]`);
  }

  return route;
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const route = await getRoute(event);

    return route(event);
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "some error happened",
      }),
    };
  }
};
