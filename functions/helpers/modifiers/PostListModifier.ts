import { Post } from "../data/Post";
import { BaseModifier } from "./BaseModifier";

export class PostListModifier extends BaseModifier {

  posts: Array<Post> = [];
  title?: string;

  constructor(context: EventContext<Env, any, Record<string, unknown>>, posts: Array<Post>, title?: string){
    super(context);
    this.posts = posts;
    this.title = title;
  }

  async element(element) {
    const postpreviewTemplate = await this.getAssetContent(
      "/templates/post/list"
    );
    const postpreviewItemTemplate = await this.getAssetContent(
      "/templates/post/item"
    );

    let postListHTML = postpreviewTemplate.replace(
      "{POST_PREVIEW_LIST}",
      this.posts
        .map((post) =>
        postpreviewItemTemplate
            .replace("{BANNER_IMAGE}", `/media/${post.BannerID}`)
            .replaceAll("{PATH}", `/posts/${post.Slug}`)
            .replace("{CATEGORY}", post.Categories.map(category => `<a href="${`/categories/${category.ID}`}" class="category">${category.Name}</a>`).join(", "))
            .replace("{TITLE}", post.Title)
            .replace("{EXCERPT}", post.Excerpt)
            .replace("{PUBLISHED_DATE}", this.formatDate(post.PublishedDate))
        )
        .join("")
    ).replace("{POST_PREVIEW_TITLE}", this.title ? `<h1>${this.title}</h1>` : "");
    element.setInnerContent(postListHTML, { html: true });
  }

}
