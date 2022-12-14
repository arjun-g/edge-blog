import { Category } from "../../../helpers/data/Category";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const categories = await (new Category(context.env.DB)).getAll();
    return new Response(JSON.stringify(categories), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { ID, Name, Content } = await context.request.json<any>();
    await (new Category(context.env.DB)).create({
        ID,
        Name,
        Content
    } as Category);
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    });
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { ID, Name, Content } = await context.request.json<any>();
    await (new Category(context.env.DB)).create({
        ID,
        Name,
        Content
    } as Category);
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    });
}