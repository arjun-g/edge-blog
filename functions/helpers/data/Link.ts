import { Base } from "./Base";

export class Link extends Base {

    ID: number
    Title: string
    URL: string
    Order: number

    async getAll() : Promise<Array<Link>>{
        const stmt = this.db.prepare(`SELECT * FROM eb_link ORDER BY [Order]`);
        const links = await stmt.all<Link>();
        return links.results;
    }

    async create(link : Link) : Promise<void>{
        await this.db.prepare(`INSERT INTO eb_link (Title, URL, [Order]) VALUES (?1, ?2, ?3)`)
            .bind(link.Title, link.URL, link.Order)
            .run();
    }

    async update(link: Link): Promise<void>{
        await this.db.prepare(`UPDATE eb_link SET Title=?2, URL=?3, [Order]=?4 WHERE ID=?1`)
            .bind(link.ID, link.Title, link.URL, link.Order)
            .run();
    }

    async del(ID: number){
        await this.db.prepare(`DELETE FROM eb_link WHERE ID=?1`)
            .bind(ID)
            .run();
    }

}