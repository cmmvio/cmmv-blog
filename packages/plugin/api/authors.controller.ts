import { Auth } from "@cmmv/auth";

import {
    Controller, Get, Post,
    Queries, Param, Body,
    Response, HttpException,
    HttpStatus
} from "@cmmv/http";

import {
    AuthorsService
} from "./authors.service";

@Controller('authors')
export class AuthorsController {
    constructor(private readonly authorsService: AuthorsService) {}

    @Get()
    @Auth({ rootOnly: true })
    async getAll(@Queries() queries: any) {
        return this.authorsService.getAll(queries);
    }

    @Post()
    @Auth({ rootOnly: true })
    async create(@Body() body: any) {
        return this.authorsService.createAuthor(body);
    }

    @Get(':id')
    async getAuthorById(@Param('id') id: string, @Response() res: any) {
        const author = await this.authorsService.getAuthorById(id);

        if(!author)
            throw new HttpException("Author not found", HttpStatus.NOT_FOUND);

        res.code(200).set({
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
            "Expires": new Date(Date.now() + 3600 * 1000).toUTCString()
        }).json(author);
    }

    @Get('slug/:slug')
    async getAuthorBySlug(@Param('slug') slug: string, @Response() res: any) {
        const author = await this.authorsService.getAuthorBySlug(slug);

        if(!author)
            throw new HttpException("Author not found", HttpStatus.NOT_FOUND);

        res.code(200).set({
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
            "Expires": new Date(Date.now() + 3600 * 1000).toUTCString()
        }).json(author);
    }
}
