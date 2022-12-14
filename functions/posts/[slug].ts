import { Post } from "../helpers/data/Post";
import { asHTMLResponse } from "../helpers/utils";
import { PostModifier } from "../helpers/modifiers/PostModifier";
import { SidebarModifier } from "../helpers/modifiers/SidebarModifier";
import { PostMetaModifier } from "../helpers/modifiers/PostMetaModifier";
import { TitleModifier } from "../helpers/modifiers/TitleModifier";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const req = await context.env.ASSETS.fetch(`${new URL(context.request.url).origin}/root`);
    const resp = await asHTMLResponse(req);
    const slug = context.params.slug as string;
    const post = await (new Post(context.env.DB)).getBySlug(slug);
    return new HTMLRewriter()
        .on("#sidebar", new SidebarModifier(context))
        .on("#content", new PostModifier(context, post))
        .on("meta[property],meta[name]", new PostMetaModifier(context, post))
        .on("title", new TitleModifier(post.Title))
        .transform(resp.clone());
}