import { Media } from "../helpers/data/Media";
import { getCachedData } from "../helpers/utils";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const ID = context.params.id as string;
  const cache = caches.default;
  let response = await cache.match(context.request);
  if (response) {
    return response;
  } else {
    const image = await context.env.STATIC.get(ID);
    if (image === null) {
      return new Response("Object Not Found", {
        status: 404,
        headers: {
          "Cache-Control": "s-maxage=10",
        },
      });
    }

    const headers = new Headers();
    image.writeHttpMetadata(headers);
    headers.set("etag", image.httpEtag);
    headers.set("Cache-Control", "s-maxage=1000000");

    response = new Response(image.body, {
      headers,
    });

    context.waitUntil(cache.put(context.request, response.clone()));
    
    return response;
  }
};
