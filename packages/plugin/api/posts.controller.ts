
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
    PostsPublicService
} from "./posts.service";

@Controller('api')
export class PostsController {
    constructor(private readonly postsPublicService: PostsPublicService) {}

    @Get("/posts", {
        contract: Application.getContract("PostsContract"),
        schema: RouterSchema.GetAll,
        summary: "Returns Posts records by filter",
        exposeFilters: true
    })
    async get(@Queries() queries: any, @Req() req: any) {
        //Application.
        //return this.postsservice.getAll(queries, req);
    }

    @Get("/posts/tags", {
        contract: Application.getContract("PostsTagsContract"),
        schema: RouterSchema.GetAll,
        summary: "Returns Posts Tags records by filter",
        exposeFilters: true
    })
    async getTags(@Queries() queries: any, @Req() req: any) {
        return this.postsPublicService.getTags();
    }

    @Post("/posts/draft")
    @Auth("post:insert")
    async draftPost(@Body() body: any, @Req() req: any) {
        return this.postsPublicService.draftPost(body);
    }

}