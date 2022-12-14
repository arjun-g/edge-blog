import { asHTMLResponse } from "../helpers/utils";
import { SidebarModifier } from "../helpers/modifiers/SidebarModifier";
import { PostListModifier } from "../helpers/modifiers/PostListModifier";
import { TitleModifier } from "../helpers/modifiers/TitleModifier";
import { Post } from "../helpers/data/Post";
import { Category } from "../helpers/data/Category";
import { PostListMetaModifier } from "../helpers/modifiers/PostListMetaModifier";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const tag = context.params.tag as string;
    const req = await context.env.ASSETS.fetch(`${new URL(context.request.url).origin}/root`);
    const resp = await asHTMLResponse(req);
    const posts = await (new Post(context.env.DB)).getByTag(tag);
    return new HTMLRewriter()
        .on("#sidebar", new SidebarModifier(context))
        .on("#content", new PostListModifier(context, posts, `#${tag}`))
        .on("title", new TitleModifier(`Posts tagged with #${tag}`))
        .on("meta[property]", new PostListMetaModifier(context, `#${tag}`, `List of posts tagged with #${tag}`))
        .transform(resp.clone());
}