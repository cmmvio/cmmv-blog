import http from 'node:http';

import {
    Controller, Ip, ContentType,
    Raw, Req, Post, Get
} from '@cmmv/http';

import {
    Auth
} from "@cmmv/auth";

import {
    AnalyticsService
} from './analytics.service';

@Controller("analytics")
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService){}

    private async parseForm(req: http.IncomingMessage) {
        const buffers: Buffer[] = [];
        for await (const chunk of req) buffers.push(chunk);
        const body = Buffer.concat(buffers).toString();
        return Object.fromEntries(new URLSearchParams(body).entries());
    }

    @Post("access")
    @ContentType("text/plain")
    @Raw()
    async getAnalyticsAccess(@Ip() ip: string, @Req() req: any){
        const parsed = await this.parseForm(req.req);

        await this.analyticsService.registryAccess({
            path: parsed.path,
            ip,
            startTime: parseInt(parsed.t),
            endTime: 0,
            referer: req.get("referer") || undefined,
            agent: req.get("user-agent") || undefined
        });

        return Buffer.from([0x00]);
    }

    @Post("unload")
    @ContentType("text/plain")
    @Raw()
    async getAnalyticsUnload(@Ip() ip: string, @Req() req: any){
        const parsed = await this.parseForm(req.req);
        await this.analyticsService.registryUnload(parsed.path, ip);
        return Buffer.from([0x00]);
    }

    @Get("report")
    //@Auth()
    async getAnalyticsReport(){
        await this.analyticsService.generateReport();
        return Buffer.from([0x00]);
    }
}

