import {
    Controller, Get, Param,
    Post, Body
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    BlogSettingsService
} from "./settings.services";

@Controller()
export class BlogSettingsController {
    constructor(
        private readonly blogSettingsService: BlogSettingsService
    ) {}

    @Post('setup')
    public async getSetup(@Body() setupData: any) {
        return this.blogSettingsService.getSetup(setupData);
    }

    @Get('settings')
    public async getSettings() {
        return this.blogSettingsService.getSettings();
    }

    @Get('settings/:key')
    public async getSetting(@Param('key') key: string) {
        return this.blogSettingsService.getSetting(key);
    }

    @Post('settings')
    @Auth({ rootOnly: true })
    public async updasertSetting(@Body() setting: { [key: string]: any }) {
        return this.blogSettingsService.upsertSetting(setting);
    }
}
