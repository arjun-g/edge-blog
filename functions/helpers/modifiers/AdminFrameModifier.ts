import { Category } from "../data/Category";
import { BaseModifier } from "./BaseModifier";

export class AdminFrameModifier extends BaseModifier {

    filePath: string

    constructor(context: EventContext<Env, any, Record<string, unknown>>, filePath: string){
        super(context);
        this.filePath = filePath;
    }

  async element(element) {
    const html = await this.getAssetContent(this.filePath);
    element.setInnerContent(html, { html: true });
  }
}
