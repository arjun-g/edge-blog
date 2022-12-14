export const onRequestGet: PagesFunction<Env> = async (context) => {
    const resp = await context.env.ASSETS.fetch(`${new URL(context.request.url).origin}/admin/root`);
    return new HTMLRewriter()
        .transform(resp.clone());
}