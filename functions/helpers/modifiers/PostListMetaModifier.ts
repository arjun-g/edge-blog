import { Post } from "../data/Post";
import { BaseModifier } from "./BaseModifier";

export class PostListMetaModifier extends BaseModifier {
  title: string;
  desc: string;

  constructor(
    context: EventContext<Env, any, Record<string, unknown>>,
    title: string,
    desc: string
  ) {
    super(context);
    this.title = title;
    this.desc = desc;
  }

  async element(element: Element) {
    console.log(this.context.env);
    switch (element.getAttribute("property")) {
      case "og:url":
      case "twitter:url":
        element.setAttribute("content", this.context.request.url);
        break;
      case "og:title":
      case "twitter:title":
        element.setAttribute("content", `${this.title} - Arjun Ganesan's Blog`);
        break;
      case "og:description":
      case "twitter:description":
        element.setAttribute("content", this.desc);
        break;
    }
  }
}
