import { MediasService } from "./medias.service";
interface ProcessImageInterface {
    image: string;
    format: string;
    maxWidth: number;
    alt: string;
    caption: string;
}
export declare class MediasController {
    private readonly mediasService;
    constructor(mediasService: MediasService);
    getMedias(queries: any, res: any): Promise<import("@cmmv/repository").IFindResponse>;
    get(hash: string, res: any): Promise<void>;
    getThumbnail(hash: string, res: any): Promise<void>;
    processImage(body: ProcessImageInterface): Promise<{
        url: string;
    }>;
}
export {};
