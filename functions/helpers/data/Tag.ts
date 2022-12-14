import { Base } from "./Base";

export class Tag extends Base {

    Tag: number
    Content: string

    async getAll() : Promise<Array<Tag>>{
        const stmt = this.db.prepare(`SELECT * FROM eb_tag`);
        const links = await stmt.all<Tag>();
        return links.results;
    }

    async getByPost(PostID: number): Promise<Array<Tag>>{
        const stmt = this.db.prepare(`SELECT eb_tag.Tag as Tag, Content FROM eb_tag JOIN eb_post_tag ON eb_tag.Tag = eb_post_tag.Tag WHERE PostID = ?1`).bind(PostID);
        const tags = await stmt.all<Tag>();
        return tags.results;
    }

    async create(tag : Tag) : Promise<void>{
        await this.db.prepare(`INSERT INTO eb_tag (Tag, Content) VALUES (?1, ?2)`)
            .bind(tag.Tag, tag.Content)
            .run();
    }

}