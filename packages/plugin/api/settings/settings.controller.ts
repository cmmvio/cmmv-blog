import {
    Config
} from "@cmmv/core";

import {
    Controller, Get, Param,
    Post, Body, Put, Response,
    ContentType, CacheControl,
    Raw
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    BlogSettingsService
} from "./settings.services";

import {
    ISettings
} from "./settings.interface";

@Controller()
export class BlogSettingsController {
    constructor(
        private readonly blogSettingsService: BlogSettingsService
    ) {}

    @Post('setup', { exclude: true })
    public async getSetup(@Body() setupData: any) {
        return this.blogSettingsService.getSetup(setupData);
    }

    @Get('settings', { exclude: true })
    @CacheControl({ maxAge: 60 * 60 * 10 })
    @ContentType('application/json')
    @Raw()
    public async getSettings() {
        return await this.blogSettingsService.getSettings();
    }

    @Get('settings-root', { exclude: true })
    @Auth({ rootOnly: true })
    public async getAllSettings() {
        return this.blogSettingsService.getAllSettings();
    }

    @Get('settings/:key', { exclude: true })
    @CacheControl({ maxAge: 60 * 60 * 10 })
    @ContentType('application/json')
    @Raw()
    public async getSetting(@Param('key') key: string) {
        return this.blogSettingsService.getSetting(key);
    }

    @Put('settings', { exclude: true })
    @Auth({ rootOnly: true })
    public async updasertSetting(@Body() setting: ISettings[]) {
        return this.blogSettingsService.upsertSetting(setting);
    }

    @Get('robots.txt', { exclude: true })
    @CacheControl({ maxAge: 60 * 60 * 24 })
    @ContentType('text/plain')
    @Raw()
    public async getRobotsTxt() {
        return Config.get<string>("blog.robotsTxt");
    }
}
