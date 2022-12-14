import { generateLogoutURL } from "@cloudflare/pages-plugin-cloudflare-access/api";

export const onRequest = (context) =>
    new Response(null, {
        status: 302,
        headers: {
            Location: generateLogoutURL({
                domain: context.env.ACCESS_DOMAIN,
            }),
        },
    });
