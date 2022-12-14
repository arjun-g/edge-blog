import { Base } from "./Base";
import { Category } from "./Category";
import { Media } from "./Media";
import { PostSeries } from "./PostSeries";
import { Tag } from "./Tag";
import { User } from "./User";


export enum PostStatus {
    DRAFT,
    PUBLISHED
};

export enum PostType {
    BLOG,
    PAGE
}

export class Author {
    ID: string
    Name: string
}

export class Post extends Base {

    ID: number
    Title: string
    Slug: string
    Data: any
    Excerpt: string

    Status: PostStatus
    Type: PostType
    
    Tags: Array<Tag>

    PublishedDate: Date
    CreatedOn: Date
    ModifiedOn: Date

    BannerID?: string
    AuthorID: string
    SeriesID?: string
    SeriesOrder?: Number

    Banner?: Media
    Author?: User
    Categories?: Array<Category>
    Series?: PostSeries

    async loadList(posts: Array<Post>){
        const mediaObj = new Media(this.db);
        return await Promise.all(posts.map(async post => {
            post.Categories = await (new Category(this.db)).getByPost(post.ID);
            post.PublishedDate = new Date(post.PublishedDate);
            post.CreatedOn = new Date(post.CreatedOn);
            post.ModifiedOn = new Date(post.ModifiedOn);
            post.Tags = await (new Tag(this.db)).getByPost(post.ID);
            if(post.BannerID){
                post.Banner = await mediaObj.get(post.BannerID);
            }
            return post;
        }));
    }

    async loadPost(post: Post): Promise<Post> {
        post.Categories = await (new Category(this.db)).getByPost(post.ID);
        post.PublishedDate = new Date(post.PublishedDate);
        post.CreatedOn = new Date(post.CreatedOn);
        post.ModifiedOn = new Date(post.ModifiedOn);
        post.Tags = await (new Tag(this.db)).getByPost(post.ID);
        if(post.BannerID){
            post.Banner = await (new Media(this.db)).get(post.BannerID);
        }
        post.Data = JSON.parse(post.Data);
        return post;
    }

    async getAll() : Promise<Array<Post>>{
        const stmt = this.db.prepare(`SELECT * FROM eb_post ORDER BY ModifiedOn DESC`);
        const posts = (await stmt.all<Post>()).results;
        return await this.loadList(posts);
    }

    async getPublished() : Promise<Array<Post>>{
        const stmt = this.db.prepare(`SELECT * FROM eb_post_published ORDER BY PublishedDate DESC`);
        const posts = (await stmt.all<Post>()).results;
        return await this.loadList(posts);
    }

    async getById(ID: string) : Promise<Post>{
        const stmt = this.db.prepare(`SELECT * FROM eb_post WHERE ID=?1`).bind(ID);
        const post = (await stmt.all<Post>()).results[0];
        return await this.loadPost(post);
    }

    async getPublishedById(ID: string){
        const stmt = this.db.prepare(`SELECT * FROM eb_post_published WHERE ID=?1`).bind(ID);
        const post = (await stmt.all<Post>()).results[0];
        if(!post) return null;
        return await this.loadPost(post);
    }

    async getPublishedByIds(IDs: Array<number>){
        const stmt = this.db.prepare(`SELECT * FROM eb_post_published WHERE ID IN (${IDs.map((_, index) => `?${index + 1}`)}) ORDER BY PublishedDate DESC`).bind(...IDs);
        const posts = (await stmt.all<Post>()).results;
        return await this.loadList(posts);
    }

    async getBySlug(slug: string) : Promise<Post>{
        const stmt = this.db.prepare(`SELECT * FROM eb_post_published WHERE Slug=?1`).bind(slug);
        const post = (await stmt.all<Post>()).results[0];
        return await this.loadPost(post);
    }

    async getByCategory(categoryID: string) : Promise<Array<Post>>{
        const stmt = this.db.prepare(`SELECT * FROM eb_post_published INNER JOIN eb_post_category ON eb_post_published.ID = eb_post_category.PostID where CategoryID = ?1`).bind(categoryID);
        const posts = (await stmt.all<Post>()).results;
        return await this.loadList(posts);
    }

    async getByTag(Tag: string) : Promise<Array<Post>>{
        const stmt = this.db.prepare(`SELECT * FROM eb_post_published INNER JOIN eb_post_tag ON eb_post_published.ID = eb_post_tag.PostID where eb_post_tag.Tag = ?1`).bind(Tag);
        const posts = (await stmt.all<Post>()).results;
        return await this.loadList(posts);
    }

    async search(text: string): Promise<Array<Post>>{
        const stmt = this.db.prepare(`SELECT * FROM eb_post_search WHERE eb_post_search MATCH ?1`).bind(text);
        let posts = (await stmt.all<Post>()).results;
        posts = await this.getPublishedByIds(posts.map(post => post.ID));
        return await this.loadList(posts);
    }

    async create(): Promise<number>{
        const ID = this.randomNumber(10000, 99999);
        const stmt = this.db.prepare(`INSERT INTO eb_post (ID, Title, Slug, CreatedOn, Status, Type, ModifiedOn) VALUES (?1, ?2, ?3, ?4, 0, 0, ?4)`).bind(ID, "Untitled Post", `untitled-post-${this.randomString()}`, new Date().getTime());
        await stmt.run();
        return ID;
    }

    async publish(ID: string, date: Date): Promise<void>{
        const draftPost = await this.getById(ID);
        const publishedPost = await this.getPublishedById(ID);
        if(publishedPost){
            console.log("PUBLI", publishedPost);
            try{
                let stmt = this.db.prepare(`INSERT INTO eb_post_search (eb_post_search, rowid, ID, Title, Slug, Data, Excerpt) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`)
                    .bind("delete", ID, ID, publishedPost.Title, publishedPost.Slug, JSON.stringify(publishedPost.Data), publishedPost.Excerpt);
                await stmt.run();
            }
            catch(ex){}
        }
        else{
            let stmt = this.db.prepare(`UPDATE eb_post SET Status=1, PublishedDate=?2, ModifiedOn=?3 WHERE ID=?1`)
                .bind(ID, date.getTime(), new Date().getTime());
            await stmt.run();
        }
        try{
            let stmt = this.db.prepare(`INSERT INTO eb_post_search (rowid, ID, Title, Slug, Data, Excerpt) VALUES (?1, ?2, ?3, ?4, ?5, ?6)`)
                .bind(ID, ID, draftPost.Title, draftPost.Slug, JSON.stringify(draftPost.Data || {}), draftPost.Excerpt);
            await stmt.run();
        }
        catch(ex){}
        
    }

    async unpublish(ID: string): Promise<void>{
        const publishedPost = await this.getPublishedById(ID);
        console.log("PUB", ID, ID, publishedPost.Title, publishedPost.Slug, JSON.stringify(publishedPost.Data), publishedPost.Excerpt);
        if(publishedPost){
            let stmt = this.db.prepare(`INSERT INTO eb_post_search (eb_post_search, rowid, ID, Title, Slug, Data, Excerpt) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`)
                .bind("delete", ID, ID, publishedPost.Title, publishedPost.Slug, JSON.stringify(publishedPost.Data), publishedPost.Excerpt);
            await stmt.run();
            stmt = this.db.prepare(`UPDATE eb_post SET Status=0, PublishedDate=NULL, ModifiedOn=?2 WHERE ID=?1`)
                .bind(ID, new Date().getTime());
            await stmt.run();
        }
    }

    async update(post: Post): Promise<void>{
        await this.db.prepare(`DELETE FROM eb_post_category WHERE PostID=?1`).bind(post.ID).run();
        await this.db.batch(post.Categories.map(category => this.db.prepare(`INSERT INTO eb_post_category (CategoryID, PostID) VALUES (?1, ?2)`).bind(category.ID, post.ID)));

        await this.db.prepare(`DELETE FROM eb_post_tag WHERE PostID=?1`).bind(post.ID).run();
        const existingTags = await (await this.db.prepare(`SELECT * FROM eb_tag`).all<Tag>()).results;
        console.log("EXIST", existingTags);
        const newTags = post.Tags.filter(tag => {
            return !existingTags.map(tag => tag.Tag).includes(tag.Tag);
        });
        console.log("NEW", newTags);
        await this.db.batch(newTags.map(tag => this.db.prepare(`INSERT INTO eb_tag (Tag) VALUES (?1)`).bind(tag.Tag)));
        await this.db.batch(post.Tags.map(tag => this.db.prepare(`INSERT INTO eb_post_tag (Tag, PostID) VALUES (?1, ?2)`).bind(tag.Tag, post.ID)));
        
        await this.db.prepare(`UPDATE eb_post SET Title=?2, Slug=?3, BannerID=?4, Data=?5, Excerpt=?6, ModifiedOn=?7 WHERE ID=?1`).bind(post.ID, post.Title, post.Slug, post.BannerID, JSON.stringify(post.Data), post.Excerpt, new Date().getTime()).run();
    }

}