import { Media } from "../../../helpers/data/Media";

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const form = await context.request.formData();
    const image = (form.get("image") as unknown) as File;

    const mediaID = await (new Media(context.env.DB)).create({
        Name: image.name,
        MimeType: image.type,
        FilePath: "",
        Size: image.size
    } as unknown as Media);
    await context.env.STATIC.put(mediaID, await image.arrayBuffer());
    return new Response(JSON.stringify({
        success : 1,
        file: {
            url: `/media/${mediaID}`
        },
        id: mediaID
     }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    });
}