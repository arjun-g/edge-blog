import { Category } from "../../../helpers/data/Category";

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const ID = context.params.id;
    const { Name, Content } = await context.request.json<any>();
    await (new Category(context.env.DB)).update({
        ID,
        Name,
        Content
    } as Category);
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const ID = context.params.id as string;
    await (new Category(context.env.DB)).del(ID);
    return new Response(JSON.stringify({}), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
}

