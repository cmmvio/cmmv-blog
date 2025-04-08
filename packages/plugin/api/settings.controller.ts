import {
    Controller, Get, Param,
    Post, Body, Put, Response
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

    @Get('api/settings', { exclude: true })
    public async getSettings(@Response() res: any) {
        const settings = await this.blogSettingsService.getSettings();
        res.code(200).json(settings);
    }

    @Get('settings-root', { exclude: true })
    @Auth({ rootOnly: true })
    public async getAllSettings() {
        return this.blogSettingsService.getAllSettings();
    }

    @Get('settings/:key', { exclude: true })
    public async getSetting(@Param('key') key: string) {
        return this.blogSettingsService.getSetting(key);
    }

    @Put('settings', { exclude: true })
    @Auth({ rootOnly: true })
    public async updasertSetting(@Body() setting: ISettings[]) {
        return this.blogSettingsService.upsertSetting(setting);
    }
}
