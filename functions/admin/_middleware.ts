import cloudflareAccessPlugin from "@cloudflare/pages-plugin-cloudflare-access";

export const onRequest: PagesFunction<Env> = (context) => {
    const url = new URL(context.request.url);
    if(url.hostname === "localhost" || url.hostname === "127.0.0.1"){
        return context.next();
    }
    if(url.pathname.indexOf("/admin/js") === 0 || url.pathname.indexOf("/admin/css") === 0){
        return context.next();
    }
    return cloudflareAccessPlugin({
        domain: context.env.ACCESS_DOMAIN,
        aud: context.env.ACCESS_AUD,
    })(context);
};