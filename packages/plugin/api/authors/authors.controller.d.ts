import { AuthorsService } from "./authors.service";
export declare class AuthorsController {
    private readonly authorsService;
    constructor(authorsService: AuthorsService);
    getAll(queries: any): Promise<import("@cmmv/repository").IFindResponse>;
    create(body: any): Promise<import("@cmmv/repository").IInsertResponse>;
    update(id: string, body: any): Promise<{
        message: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    getAuthorById(id: string, res: any): Promise<any>;
    getAuthorBySlug(slug: string, res: any): Promise<any>;
}
