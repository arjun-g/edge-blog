import { Base } from "./Base"

export class Media extends Base {
    ID?: string
    Name: string
    MimeType: string
    FilePath: string
    Size: Number

    URL: string

    async create(media: Media): Promise<string> {
        const ID = this.randomString();
        await this.db.prepare(`INSERT INTO eb_media (ID, Name, MimeType, FilePath, Size) VALUES (?1, ?2, ?3, ?4, ?5)`)
            .bind(ID, media.Name, media.MimeType, media.FilePath, media.Size)
            .run();
        return ID;
    }

    async get(ID: string) : Promise<Media>{
        const stmt = this.db.prepare(`SELECT * FROM eb_media WHERE ID=?1`).bind(ID);
        return (await stmt.all<Media>()).results[0];
    }

}

