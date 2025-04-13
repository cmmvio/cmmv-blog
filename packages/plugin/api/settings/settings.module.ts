import { Module } from '@cmmv/core';

import { SettingsController } from "./settings.controller";
import { SettingsService } from "./settings.service";

export const SettingsModule = new Module('blog_settings', {
    controllers: [SettingsController],
    providers: [SettingsService]
});
