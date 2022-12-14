import { Post } from "../../../../helpers/data/Post";

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const ID = context.params.id as string;
    const { PublishedDate }  = await context.request.json<any>();
    const postObj = new Post(context.env.DB);
    await postObj.publish(ID, new Date(PublishedDate));
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    });
}