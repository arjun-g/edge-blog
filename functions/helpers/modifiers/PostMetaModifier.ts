import { Post } from "../data/Post";
import { BaseModifier } from "./BaseModifier";

export class PostMetaModifier extends BaseModifier {

post: Post

constructor(context: EventContext<Env, any, Record<string, unknown>>, post: Post) {
    super(context);
    this.post = post;
}


  async element(element: Element) {
    console.log(this.context.env);
    switch(element.getAttribute("property")){
        case "og:url":
        case "twitter:url":
            element.setAttribute("content", this.context.request.url);
            break;
        case "og:title":
        case "twitter:title":
            element.setAttribute("content", `${this.post.Title} - Arjun Ganesan's Blog`);
            break;
        case "og:description":
        case "twitter:description":
            element.setAttribute("content", this.post.Excerpt);
            break;
        case "og:image":
        case "twitter:image":
            element.setAttribute("content", `${this.context.env.WEBSITE_ORIGIN}/media/${this.post.BannerID}`);
            break;
    }
    switch(element.getAttribute("name")){
        case "description":
            element.setAttribute("content", this.post.Excerpt);
            break;
    }
  }

}
