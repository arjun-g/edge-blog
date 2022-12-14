export async function asHTMLResponse(resp: Response){
    const text = await resp.text();
    return new Response(text, {
        headers: {
            "Content-Type": "text/html"
        }
    });
}