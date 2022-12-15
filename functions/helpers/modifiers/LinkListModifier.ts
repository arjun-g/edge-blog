import { Link } from "../data/Link";
import { BaseModifier } from "./BaseModifier";

export class LinkListModifier extends BaseModifier {
  async element(element) {
    const linkTemplate = await this.getAssetContent(
      "/templates/link/list"
    );
    const linkItemTemplate = await this.getAssetContent(
      "/templates/link/item"
    );

    const links = await this.getCached<Array<Link>>("/obj/links/withcount", await (new Link(this.context.env.DB)).getAll());
    
    const linkListHTML = linkTemplate.replace(
      "{LINK_LIST}",
      links
        .map((link) =>
            linkItemTemplate
            .replace("{URL}", link.URL)
            .replace("{TITLE}", link.Title)
        )
        .join("")
    );
    element.replace(linkListHTML, { html: true });
  }
}
