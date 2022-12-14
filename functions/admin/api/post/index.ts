import { Post } from "../../../helpers/data/Post";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const posts = await (new Post(context.env.DB)).getAll();
    return new Response(JSON.stringify({ posts }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const postId = await (new Post(context.env.DB)).create();
    return new Response(JSON.stringify({ ID: postId }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
}
