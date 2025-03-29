
/**
    **********************************************
    This script was generated automatically by CMMV.
    It is recommended not to modify this file manually,
    as it may be overwritten by the application.
    **********************************************
**/

import { Application } from "@cmmv/core";
import { Auth } from "@cmmv/auth";

import {
   Controller, Get, Post, Put, Delete,
   Queries, Param, Body, Req, RouterSchema
} from "@cmmv/http";

import {
    PostsService
} from "@generated/services/blog/posts.service"

@Controller('api')
export class PostsController {
    constructor(private readonly postsservice: PostsService) {}

    @Get("/posts", {
        contract: Application.getContract("PostsContract"),
        schema: RouterSchema.GetAll,
        summary: "Returns Posts records by filter",
        exposeFilters: true
    })
    async get(@Queries() queries: any, @Req() req: any) {
        return this.postsservice.getAll(queries, req);
    }
}