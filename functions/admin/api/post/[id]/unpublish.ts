import { Post } from "../../../../helpers/data/Post";

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const ID = context.params.id as string;
    const postObj = new Post(context.env.DB);
    await postObj.unpublish(ID);
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    });
}