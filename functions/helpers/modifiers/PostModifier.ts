import { Category } from "../data/Category";
import { Post } from "../data/Post";
import { BaseModifier } from "./BaseModifier";
import { CategoryModifier } from "./CategoryModifier";
import { LinkListModifier } from "./LinkListModifier";

export class PostModifier extends BaseModifier {

    post: Post

    constructor(context: EventContext<Env, any, Record<string, unknown>>, post: Post) {
        super(context);
        this.post = post;
    }

    toHTML(data) {
        const blocks = data.blocks;
        let convertedHtml = "";
        blocks.map(block => {

            switch (block.type) {
                case "header":
                    convertedHtml += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                    break;
                case "embed":
                    convertedHtml += `<div><iframe style="width: 100%" height="400" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
                    break;
                case "paragraph":
                    convertedHtml += `<p>${block.data.text}</p>`;
                    break;
                case "delimiter":
                    convertedHtml += "<hr />";
                    break;
                case "image":
                    convertedHtml += `<div class="image"><img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em></div>`;
                    break;
                case "list":
                    convertedHtml += `<ul>${block.data.items.map(item => `<li>${item}</li>`).join("")}</ul>`;
                    break;
                case "code":
                    convertedHtml += `<pre><code class="hljs language-${block.data.languageCode}">${block.data.code}</code></pre>`;
                    break;
                case "raw":
                    convertedHtml += block.data.html;
                    break;
                case "carousel":
                    convertedHtml += `<div class="carousel glider-contain">
                        <div class="glider">
                            ${block.data.map(file => `<div class="image"><img src="${file.url}" /><br /><em>${file.caption}</em></div>`).join("")}
                        </div>
                        <button aria-label="Previous" class="glider-prev">«</button>
                        <button aria-label="Next" class="glider-next">»</button>
                        <div role="tablist" class="dots"></div>
                    </div>`
                    break;
                default:
                    console.log("Unknown block type", block.type);
                    break;
            }
        });
        return convertedHtml;
    }

    async element(element) {
        const postTemplate = await this.getAssetContent(
            "/templates/post/view"
        );
        const postHTML = postTemplate
            .replace("{BANNER_IMAGE}", `/media/${this.post.BannerID}`)
            .replace("{SHOW_BANNER}", this.post.BannerID ? "flex" : "none")
            .replace("{TITLE}", this.post.Title)
            .replace("{PUBLISHED_DATE}", this.formatDate(this.post.PublishedDate))
            .replace("{CONTENT}", this.toHTML(this.post.Data))
            .replace("{CATEGORY}", this.post.Categories.map(category => `<a href="${`/categories/${category.ID}`}" class="category">${category.Name}</a>`).join(", "))
            .replace("{TAGS}", this.post.Tags.map(tag => {
                return `<a href="/tags/${tag.Tag}">#${tag.Tag}</a>`;
            }).join(""));
        element.setInnerContent(postHTML, { html: true });
    }

}