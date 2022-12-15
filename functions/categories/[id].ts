import { asHTMLResponse, getCachedData } from "../helpers/utils";
import { SidebarModifier } from "../helpers/modifiers/SidebarModifier";
import { PostListModifier } from "../helpers/modifiers/PostListModifier";
import { TitleModifier } from "../helpers/modifiers/TitleModifier";
import { Post } from "../helpers/data/Post";
import { Category } from "../helpers/data/Category";
import { PostListMetaModifier } from "../helpers/modifiers/PostListMetaModifier";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const categoryID = context.params.id as string;
    const req = await context.env.ASSETS.fetch(`${new URL(context.request.url).origin}/root`);
    const resp = await asHTMLResponse(req);
    const category = await getCachedData<Category>(context, `/obj/categories/${categoryID}`, async () => {
        return await (new Category(context.env.DB)).get(categoryID);
    });
    const posts = await getCachedData<Array<Post>>(context, "/obj/posts/categories", async () => {
        return await (new Post(context.env.DB)).getByCategory(categoryID)
    });
    return new HTMLRewriter()
        .on("#sidebar", new SidebarModifier(context))
        .on("#content", new PostListModifier(context, posts, category.Name))
        .on("title", new TitleModifier(`${category.Name} related posts`))
        .on("meta[property]", new PostListMetaModifier(context, category.Name, `List of posts related to ${category.Name}`))
        .transform(resp.clone());
}