import { MediasService } from "../medias/medias.service";
export declare class SitemapService {
    private readonly mediasService;
    constructor(mediasService: MediasService);
    generateSitemapIndex(): Promise<string>;
    getPostSitemap(type?: string): Promise<string>;
    getCategorySitemap(): Promise<string>;
    getTagsSitemap(): Promise<string>;
}
