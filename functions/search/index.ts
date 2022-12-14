import { asHTMLResponse } from "../helpers/utils";
import { SidebarModifier } from "../helpers/modifiers/SidebarModifier";
import { PostListModifier } from "../helpers/modifiers/PostListModifier";
import { Post } from "../helpers/data/Post";
import { PostListMetaModifier } from "../helpers/modifiers/PostListMetaModifier";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const req = await context.env.ASSETS.fetch(`${new URL(context.request.url).origin}/root`);
    const resp = await asHTMLResponse(req);
    const text = new URL(context.request.url).searchParams.get("search");
    const posts = await (new Post(context.env.DB)).search(text);
    return new HTMLRewriter()
        .on("#sidebar", new SidebarModifier(context))
        .on("#content", new PostListModifier(context, posts, `Searching for "${text}"`))
        .on("meta[property]", new PostListMetaModifier(context, `Search for "${text}"`, `List of posts containing the text "${text}"`))
        .transform(resp.clone());
}