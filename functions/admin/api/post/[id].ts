import { Post } from "../../../helpers/data/Post";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const ID = context.params.id as string;
    const postObj = new Post(context.env.DB);
    const post = await postObj.getById(ID);
    return new Response(JSON.stringify(post), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    });
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const ID = context.params.id as string;
    const body = await context.request.json<Post>();
    const postObj = new Post(context.env.DB);
    await postObj.update(body);
    const post = await postObj.getById(ID);
    return new Response(JSON.stringify(post), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    });
}