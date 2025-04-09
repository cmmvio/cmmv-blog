import { SitemapService } from "./sitemap.service";
export declare class SitemapController {
    private readonly sitemapService;
    constructor(sitemapService: SitemapService);
    getSitemapHandler(): Promise<string>;
    getSitemap(): Promise<string>;
    getSitemapIndex(): Promise<string>;
    getPageSitemap(): Promise<string>;
    getCategorySitemap(): Promise<string>;
    getTagSitemap(): Promise<string>;
}
