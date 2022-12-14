import { Link } from "../../../helpers/data/Link";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const links = await (new Link(context.env.DB)).getAll();
    return new Response(JSON.stringify(links), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { Title, URL, Order } = await context.request.json<any>();
    await (new Link(context.env.DB)).create({
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