import {
    Controller, Get,
    Queries, Req, Raw,
    CacheControl, ContentType
} from "@cmmv/http";

import {
    Cache
} from "@cmmv/cache";

import {
    FeedService
} from "./feed.service";

@Controller()
export class FeedController {
    constructor(private readonly feedService: FeedService){}

    @Get("feed", { exclude: true })
    @Cache("feed:getAll")
    @CacheControl({ maxAge: 3600, public: true })
    @ContentType('application/xml')
    @Raw()
    async get(@Queries() queries: any, @Req() req: any) {
        return this.feedService.getFeed(queries, req);
    }
}
