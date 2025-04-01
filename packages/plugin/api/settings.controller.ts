import {
    Controller, Get, Param,
    Post, Body
} from "@cmmv/http";

import {
    BlogSettingsService
} from "./settings.services";

@Controller('api')
export class BlogSettingsController {
    constructor(
        private readonly blogSettingsService: BlogSettingsService
    ) {}

    @Get('settings')
    public async getSettings() {
        return this.blogSettingsService.getSettings();
    }

    @Get('settings/:key')
    public async getSetting(@Param('key') key: string) {
        return this.blogSettingsService.getSetting(key);
    }

    @Post('settings')
    public async updasertSetting(@Body() setting: { [key: string]: any }) {
        return this.blogSettingsService.upsertSetting(setting);
    }
}
