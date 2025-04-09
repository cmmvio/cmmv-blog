import { MediasService } from "../medias/medias.service";
export declare class AuthorsService {
    private readonly mediasService;
    constructor(mediasService: MediasService);
    getAll(queries?: any): Promise<import("@cmmv/repository").IFindResponse>;
    getAuthorById(id: string): Promise<any>;
    getAuthorBySlug(slug: string): Promise<any>;
    createAuthor(data: any): Promise<import("@cmmv/repository").IInsertResponse>;
    updateAuthor(id: string, data: {
        [key: string]: any;
    }): Promise<{
        message: string;
    }>;
    deleteAuthor(id: string): Promise<{
        message: string;
    }>;
}
