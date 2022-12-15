export async function asHTMLResponse(resp: Response){
    const text = await resp.text();
    return new Response(text, {
        headers: {
            "Content-Type": "text/html"
        }
    });
}

export async function getCachedData<T>(context: EventContext<Env, any, any>, path, dataFunc): Promise<T>{
    const url = new URL(context.request.url);
    const cacheKey = new Request(`${url.origin}${path}`);
    const cache = caches.default;
    let response = await cache.match(cacheKey);
    if(response){
        const json = await response.json<T>();
        return json;
    }
    else{
        const data = await dataFunc();
        const newresp = new Response(JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "s-maxage=10000"
            }
        });
        context.waitUntil(cache.put(cacheKey, newresp));
        return data;
    }
}

export async function clearCache(context, path){
    const url = new URL(context.request.url);
    const cacheKey = new Request(`${url.origin}${path}`);
    const cache = caches.default;
    await cache.delete(cacheKey);
}