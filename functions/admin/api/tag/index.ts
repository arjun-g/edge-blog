import { Tag } from "../../../helpers/data/Tag";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const tags = await (new Tag(context.env.DB)).getAll();
    return new Response(JSON.stringify(tags), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { Tag: TagText } = await context.request.json<any>();
    await (new Tag(context.env.DB)).create({
        Tag: TagText
    } as Tag);
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    });
}