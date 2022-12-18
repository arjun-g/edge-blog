# edge-blog
A dynamic blog built to be hosted in Cloudflare using its products like Pages, D1, R2, Functions, Access and Web Analytics

## Requirements
- node.js >= 16.13.0
- wrangler@d1 - For D1 support in Cli

## Getting Started

Before you start, go through the post in https://arjun-g.com/posts/dynamic-blog-with-cloudflare to understand more.

If you want to create a new D1 database for the blog run the below command from the root

```
npm run create-db
```

Rename the `wrangler.toml.sample` in the root to `wrangler.toml` and fill in the below details in `wrangler.toml`

```
account_id=<Cloudflare Acccount ID>
[[ d1_databases ]]
binding = "DB"
database_name = "BLOG_DB"
database_id = <ID of the newly created or existing D1 database>
[[r2_buckets]]
binding = "STATIC"
preview_bucket_name = <Name of the bucket for preview>
bucket_name = <Name of the bucket to use in production>
[vars]
WEBSITE_ORIGIN = "http://localhost"
[env.production.vars]
WEBSITE_ORIGIN = "https://arjun-g.com"
ACCESS_DOMAIN = <Cloudflare Zero Trust domain>
ACCESS_AUD = <AUD obtained from creating the Application in cloudflare access>
```

## Running Locally

To initiate the local database run the below command,

```
npm run init-local-db
```

Then to start the blog run,

```
npm start
```

## Deploying to production

To initiate the production database run the below command. Be warned this will delete the existing data if the database is already initiated.

```
npm run init-prod-db
```

Then configure the page to auto deploy the git repo.