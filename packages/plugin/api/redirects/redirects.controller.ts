import {
    Controller, Get, Res, Param,
    Query
} from "@cmmv/http";

import {
    RedirectsService
} from "./redirects.service";

@Controller()
export class RedirectsController {
    constructor(private readonly redirectsService: RedirectsService){}

    // https://blog.cmmv.io/?p=123
    @Get("/", {
        summary: "Wordpress permalink default",
        exposeFilters: true,
        exclude: true
    })
    async handlerReferer(@Query("p") refererId: string, @Res() response: any){
        if (!refererId)
            throw new Error("Referer ID is required");

        const redirect = await this.redirectsService.getRedirectByReferer(refererId);
        response.res.writeHead(redirect.codeStatus, { Location: redirect.redirectUrl });
        response.res.end();
    }

    // https://blog.cmmv.io/arquivos/123
    @Get(":file/:refererId", {
        summary: "Wordpress permalink numeric",
        exposeFilters: true,
        exclude: true
    })
    async handlerNumeric(@Param("refererId") refererId: string, @Res() response: any){
        const redirect = await this.redirectsService.getRedirectByReferer(refererId);
        response.res.writeHead(redirect.codeStatus, { Location: redirect.redirectUrl });
        response.res.end();
    }

    // https://blog.cmmv.io/post-sample/
    @Get(":slug/", {
        summary: "Wordpress permalink format Day name",
        exposeFilters: true,
        exclude: true
    })
    async handlerSlug(@Param("slug") slug: string, @Res() response: any){
        const redirect = await this.redirectsService.getRedirect(slug);
        response.res.writeHead(redirect.codeStatus, { Location: redirect.redirectUrl });
        response.res.end();
    }

    // https://blog.cmmv.io/post-sample
    @Get(":slug", {
        summary: "Wordpress permalink format Day name",
        exposeFilters: true,
        exclude: true
    })
    async handlerSlugWithoutSlash(@Param("slug") slug: string, @Res() response: any){
        const redirect = await this.redirectsService.getRedirect(slug);
        response.res.writeHead(redirect.codeStatus, { Location: redirect.redirectUrl });
        response.res.end();
    }

    // https://blog.cmmv.io/2025/04/13/post-sample
    /*@Get(":year/:month/:day/:slug", {
        summary: "Wordpress permalink format Day name",
        exposeFilters: true,
        exclude: true
    })
    async handlerDayNameLink(@Param("slug") slug: string, @Res() response: any){
        const redirect = await this.redirectsService.getRedirect(slug);
        response.res.writeHead(redirect.codeStatus, { Location: redirect.redirectUrl });
        response.res.end();
    }*/

    //https://blog.cmmv.io/2025/04/post-sample/
    @Get(":year/:month/:day/:slug/", {
        summary: "Wordpress permalink format Day name",
        exposeFilters: true,
        exclude: true
    })
    async handlerDayNameLinkSlug(@Param("slug") slug: string, @Res() response: any){
        const redirect = await this.redirectsService.getRedirect(slug);
        response.res.writeHead(redirect.codeStatus, { Location: redirect.redirectUrl });
        response.res.end();
    }

    // https://blog.cmmv.io/2025/04/post-sample
    /*@Get(":year/:month/:slug", {
        summary: "Wordpress permalink format Month name",
        exposeFilters: true,
        exclude: true
    })
    async handlerMonthNameLink(@Param("slug") slug: string, @Res() response: any){
        const redirect = await this.redirectsService.getRedirect(slug);
        response.res.writeHead(redirect.codeStatus, { Location: redirect.redirectUrl });
        response.res.end();
    }*/

    // https://blog.cmmv.io/2025/04/post-sample/
    @Get(":year/:month/:slug/", {
        summary: "Wordpress permalink format Month name",
        exposeFilters: true,
        exclude: true
    })
    async handlerMonthNameLinkSlug(@Param("slug") slug: string, @Res() response: any){
        const redirect = await this.redirectsService.getRedirect(slug);
        response.res.writeHead(redirect.codeStatus, { Location: redirect.redirectUrl });
        response.res.end();
    }
}
