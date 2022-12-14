interface Env {
	KV: KVNamespace;
	DB: D1Database
	STATIC: R2Bucket
	WEBSITE_ORIGIN: string
	ACCESS_DOMAIN: string
	ACCESS_AUD: string
}