import { Module } from '@cmmv/core';

import { BlogSettingsController } from "./settings.controller";
import { BlogSettingsService } from "./settings.services";

export const BlogSettingsModule = new Module('blog_settings', {
    controllers: [BlogSettingsController],
    providers: [BlogSettingsService]
});
