import { asHTMLResponse, getCachedData } from "./helpers/utils";
import { SidebarModifier } from "./helpers/modifiers/SidebarModifier";
import { PostListModifier } from "./helpers/modifiers/PostListModifier";
import { Post } from "./helpers/data/Post";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const req = await context.env.ASSETS.fetch(`${new URL(context.request.url).origin}/root`);
    const resp = await asHTMLResponse(req);
    const posts = await getCachedData<Array<Post>>(context, "/obj/posts/published", async () => {
        return await (new Post(context.env.DB)).getPublished();
    });
    return new HTMLRewriter()
        .on("#sidebar", new SidebarModifier(context))
        .on("#content", new PostListModifier(context, posts))
        .transform(resp.clone());
}