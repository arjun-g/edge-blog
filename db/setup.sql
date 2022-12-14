/* POST */

DROP TABLE IF EXISTS eb_post;
CREATE TABLE eb_post (ID INT PRIMARY KEY, Title TEXT, Slug TEXT, BannerID TEXT, AuthorID TEXT, PublishedDate INT, CreatedOn INT, Data TEXT, Excerpt TEXT, Status INT DEFAULT 0 NOT NULL, Type INT DEFAULT 0 NOT NULL, ModifiedOn INT);

DROP TABLE IF EXISTS eb_post_meta;
CREATE TABLE eb_post_meta (ID INT PRIMARY KEY, Key TEXT DEFAULT 'property' NOT NULL, Value TEXT, Content TEXT, FOREIGN KEY(ID) REFERENCES eb_post(ID) ON DELETE CASCADE);

DROP VIEW IF EXISTS eb_post_published;
CREATE VIEW eb_post_published AS
SELECT ID, Title, Slug, BannerID, AuthorID, PublishedDate, CreatedOn, Data, Excerpt, Type, ModifiedOn from eb_post WHERE Status = 1;

DROP TABLE IF EXISTS eb_post_search;
CREATE VIRTUAL TABLE eb_post_search USING fts5(ID, Title, Slug, Data, Excerpt, content='eb_post_published', content_rowid='ID');

DROP TABLE IF EXISTS eb_series;
CREATE TABLE eb_series (ID TEXT PRIMARY KEY, Title TEXT, Content TEXT);

DROP TABLE IF EXISTS eb_post_series;
CREATE TABLE eb_post_series (PostID INT, SeriesID TEXT, [Order] INT, FOREIGN KEY (PostID) REFERENCES eb_post(ID) ON DELETE CASCADE, FOREIGN KEY (SeriesID) REFERENCES eb_series(ID) ON DELETE CASCADE);

/* CATEGORY */

DROP TABLE IF EXISTS eb_category;
CREATE TABLE eb_category (ID TEXT PRIMARY KEY, Name TEXT, Content TEXT);

DROP TABLE IF EXISTS eb_post_category;
CREATE TABLE eb_post_category (PostID INT, CategoryID TEXT, FOREIGN KEY (PostID) REFERENCES eb_post(ID) ON DELETE CASCADE, FOREIGN KEY (CategoryID) REFERENCES eb_category(ID) ON DELETE CASCADE);

DROP VIEW IF EXISTS eb_category_published_post_count;
CREATE VIEW eb_category_published_post_count AS
SELECT CategoryID as ID, Count (*) as [Count] from eb_post_category INNER JOIN eb_post_published ON eb_post_category.PostID = eb_post_published.ID GROUP BY CategoryID;

DROP VIEW IF EXISTS eb_category_with_post_count;
CREATE VIEW eb_category_with_post_count AS 
SELECT eb_category.ID as ID, Name, Content, [Count] FROM eb_category JOIN eb_category_published_post_count ON eb_category.ID = eb_category_published_post_count.ID;

/* TAG */

DROP TABLE IF EXISTS eb_tag;
CREATE TABLE eb_tag (Tag TEXT PRIMARY KEY, Content TEXT);

DROP TABLE IF EXISTS eb_post_tag;
CREATE TABLE eb_post_tag (PostID INT, Tag TEXT);

DROP VIEW IF EXISTS eb_tag_published_post_count;
CREATE VIEW eb_tag_published_post_count AS
SELECT Tag, Count (*) as [Count] from eb_post_tag INNER JOIN eb_post_published ON eb_post_tag.PostID = eb_post_published.ID GROUP BY Tag;

/* MEDIA */

DROP TABLE IF EXISTS eb_media;
CREATE TABLE eb_media (ID TEXT PRIMARY KEY, Name TEXT, MimeType TEXT, FilePath TEXT, Size INT);

/* LNK */

DROP TABLE IF EXISTS eb_link;
CREATE TABLE eb_link (ID INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT, URL TEXT, [Order] INT);