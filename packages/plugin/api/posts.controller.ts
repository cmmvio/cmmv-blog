import { Application } from "@cmmv/core";
import { Auth } from "@cmmv/auth";

import {
   Controller, Get, Post, Put, Delete,
   Queries, Param, Body, Req, RouterSchema,
   User, Response
} from "@cmmv/http";

import {
    PostsPublicService
} from "./posts.service";

@Controller('blog')
export class PostsController {
    constructor(private readonly postsPublicService: PostsPublicService) {}

    @Get("posts", {
        contract: Application.getContract("PostsContract"),
        schema: RouterSchema.GetAll,
        summary: "Returns Posts records by filter",
        exposeFilters: true,
        exclude: true
    })
    async get(@Queries() queries: any, @Req() req: any) {
        return this.postsPublicService.getAllPosts(queries, req);
    }

    @Get("pages", {
        contract: Application.getContract("PostsContract"),
        schema: RouterSchema.GetAll,
        summary: "Returns Pages records by filter",
        exposeFilters: true,
        exclude: true
    })
    async getPages(@Queries() queries: any, @Req() req: any) {
        return this.postsPublicService.getAllPages(queries, req);
    }

    @Get("posts/slug/:slug", {
        contract: Application.getContract("PostsContract"),
        schema: RouterSchema.GetByID,
        summary: "Returns Posts record by slug",
        exposeFilters: true,
        exclude: true
    })
    async getBySlug(@Param("slug") slug: string, @Response() res: any) {
        const post = await this.postsPublicService.getPostBySlug(slug);
        res.code(200).contentType("text/json").send(post);
    }

    @Get("pages/slug/:slug", {
        contract: Application.getContract("PostsContract"),
        schema: RouterSchema.GetByID,
        summary: "Returns Pages record by slug",
        exposeFilters: true,
        exclude: true
    })
    async getPageBySlug(@Param("slug") slug: string, @Response() res: any) {
        const page = await this.postsPublicService.getPageBySlug(slug);
        res.code(200).contentType("text/json").send(page);
    }

    @Get("posts/:id", {
        contract: Application.getContract("PostsContract"),
        schema: RouterSchema.GetByID,
        summary: "Returns Posts record by id",
        exposeFilters: true,
        exclude: true
    })
    async getById(@Param("id") id: string, @Response() res: any) {
        const post = await this.postsPublicService.getPostById(id);
        res.code(200).contentType("text/json").send(post);
    }

    @Get("pages/:id", {
        contract: Application.getContract("PostsContract"),
        schema: RouterSchema.GetByID,
        summary: "Returns Pages record by id",
        exposeFilters: true,
        exclude: true
    })
    async getPageById(@Param("id") id: string, @Response() res: any) {
        const page = await this.postsPublicService.getPageById(id);
        res.code(200).contentType("text/json").send(page);
    }

    @Get("posts/tags", {
        contract: Application.getContract("PostsTagsContract"),
        schema: RouterSchema.GetAll,
        summary: "Returns Posts Tags records by filter",
        exposeFilters: true,
        exclude: true
    })
    async getTags(@Queries() queries: any, @Response() res: any) {
        const tags = await this.postsPublicService.getTags(queries);
        res.code(200).contentType("text/json").send(tags)
    }

    @Post("posts", { exclude: true })
    @Auth("post:insert")
    async savePost(@Body() body: any, @User() user: any) {
        return this.postsPublicService.savePost(body, user);
    }

    @Post("pages", { exclude: true })
    @Auth("pages:insert")
    async savePage(@Body() body: any, @User() user: any) {
        return this.postsPublicService.savePage(body, user);
    }
}