import { Category } from "../data/Category";
import { BaseModifier } from "./BaseModifier";
import { CategoryModifier } from "./CategoryModifier";
import { LinkListModifier } from "./LinkListModifier";

export class SidebarModifier extends BaseModifier{

    async element(element) {
        const sidebarReq = await this.getAssetReq("/templates/sidebar");
        const modifiedResp = new HTMLRewriter()
            .on("#categorylist", new CategoryModifier(this.context))
            .on("#linklist", new LinkListModifier(this.context))
            .transform(sidebarReq.clone());
        const sidebarHTML = await modifiedResp.text();
        element.replace(sidebarHTML, { html: true });
    }

}