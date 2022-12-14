export class BaseModifier{

    context: EventContext<Env, any, Record<string, unknown>> = null;

    constructor(context: EventContext<Env, any, Record<string, unknown>>){
        this.context = context;
    }

    async getAssetContent(path: string){
        const reqURL = new URL(this.context.request.url);
        const assetURL = new URL(`${reqURL.origin}${path}`);
        const assetReq = await this.context.env.ASSETS.fetch(assetURL);
        return await assetReq.text();
    }

    async getAssetReq(path: string){
        const reqURL = new URL(this.context.request.url);
        const assetURL = new URL(`${reqURL.origin}${path}`);
        const assetReq = await this.context.env.ASSETS.fetch(assetURL);
        return assetReq;
    }

    formatDate(date: Date | number){
        const dateObj = new Date(date);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    }

}
