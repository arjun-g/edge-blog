import { Link } from "../../../helpers/data/Link";

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const ID = context.params.id as any;
    const { Title, URL, Order } = await context.request.json<any>();
    await (new Link(context.env.DB)).update({
        ID,
        Title,
        URL,
        Order
    } as Link);
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    });
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const ID = context.params.id as any;
    await (new Link(context.env.DB)).del(ID);
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
}

