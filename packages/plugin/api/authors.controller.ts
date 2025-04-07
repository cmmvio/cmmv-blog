import { Application } from "@cmmv/core";
import { Auth } from "@cmmv/auth";

import {
    Controller, Get, Post, Put, Delete,
    Queries, Param, Body, Req, RouterSchema
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
}
