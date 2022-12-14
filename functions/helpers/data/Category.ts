import { Base } from "./Base";

export class Category extends Base {

    ID: string
    Name: string
    Content: string
    Count: Number

    static toCategory(ID: string, Name: string, Content: string): Category{
        return {
            ID,
            Name,
            Content
        } as Category;
    }

    async getAll() : Promise<Array<Category>>{
        const stmt = this.db.prepare(`SELECT * FROM eb_category`);
        const categories = await stmt.all<Category>();
        return categories.results;
    }

    async get(ID: string) : Promise<Category>{
        const stmt = this.db.prepare(`SELECT * FROM eb_category WHERE ID=?1`).bind(ID);
        const categories = await stmt.all<Category>();
        return categories.results[0];
    }

    async getByPost(PostID: number): Promise<Array<Category>> {
        console.log("POST", PostID);
        const stmt = this.db.prepare(`SELECT ID, Name, Content FROM eb_category JOIN eb_post_category ON eb_category.ID = eb_post_category.CategoryID WHERE PostId = ?1`).bind(PostID);
        const categories = await stmt.all<Category>();
        return categories.results;
    }

    async getAllWithCount() : Promise<Array<Category>>{
        const stmt = this.db.prepare(`SELECT * FROM eb_category_with_post_count`);
        const categories = await stmt.all<Category>();
        return categories.results;
    }

    async create(category : Category) : Promise<void>{
        await this.db.prepare(`INSERT INTO eb_category (ID, Name, Content) VALUES (?1, ?2, ?3)`)
            .bind(category.ID, category.Name, category.Content)
            .run();
    }

    async update(category : Category) : Promise<void>{
        await this.db.prepare(`UPDATE eb_category SET Name=?2, Content=?3 WHERE ID=?1`)
            .bind(category.ID, category.Name, category.Content)
            .run();
    }

    async del(ID: string): Promise<void> {
        await this.db.prepare(`DELETE FROM eb_category WHERE ID=?1`)
            .bind(ID)
            .run();
    }

}