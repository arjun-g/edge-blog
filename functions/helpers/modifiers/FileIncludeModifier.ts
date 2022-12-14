import { BaseModifier } from "./BaseModifier";

export class FileIncludeModifier extends BaseModifier{

    async comments(comment: Comment){

        const PATH_REGEX = /include\s"(.*)"/ig;
        const path = PATH_REGEX.exec(comment.text)[1];

        const url = new URL(path, this.context.request.url);

        const request = new Request(url.toString());

        const resp = await this.context.env.ASSETS.fetch(request);
        const text = await resp.text();

        comment.replace(text, { html: true });

    }

}