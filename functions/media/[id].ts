import { Media } from "../helpers/data/Media";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const ID = context.params.id;
    const image = await context.env.STATIC.get(ID);
    if (image === null) {
        return new Response('Object Not Found', { status: 404 });
      }

      const headers = new Headers();
      image.writeHttpMetadata(headers);
      headers.set('etag', image.httpEtag);

      return new Response(image.body, {
        headers,
      });
}