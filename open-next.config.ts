import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Defaults only. No incremental cache (R2) / queue (Durable Objects) bindings:
// nothing in the app uses `revalidate`, `unstable_cache` or tag revalidation,
// and getArticleByIdCached is per-request. Adding an R2 cache later is a
// config-only change here plus a binding in wrangler.jsonc.
export default defineCloudflareConfig({});
