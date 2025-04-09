import { AbstractService } from "@cmmv/core";
export declare class MediasService extends AbstractService {
    getImageUrl(image: string, format?: string, maxWidth?: number, alt?: string, caption?: string): Promise<string>;
    getImage(hash: string): Promise<Buffer<ArrayBufferLike>>;
    getThumbnail(hash: string): Promise<Buffer<ArrayBufferLike>>;
    getMedias(queries: any): Promise<import("@cmmv/repository").IFindResponse>;
}
