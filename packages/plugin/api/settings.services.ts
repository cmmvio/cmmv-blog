import {
    Service
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

import {
    ISettings
} from "./settings.interface";

@Service("blog_settings")
export class BlogSettingsService {

    /**
     * Get all settings
     * @returns {Promise<any>}
     */
    public async getSettings() : Promise<ISettings[]> {
        const SettingsRepository = Repository.getEntity("SettingsEntity");

        const settings = await Repository.findAll(SettingsRepository, {}, [], {
            select: [ "group", "key", "value", "type", "flags" ]
        });

        return settings ? settings.data : [];
    }

    /**
     * Get a setting by key
     * @param {string} key - The key of the setting
     * @returns {Promise<ISettings>}
     */
    public async getSetting(key: string) : Promise<ISettings | null> {
        const SettingsRepository = Repository.getEntity("SettingsEntity");

        const setting = await Repository.findOne(SettingsRepository, { key }, {
            select: [ "group", "key", "value", "type", "flags" ]
        });

        return setting ? setting.data : null;
    }

    /**
     * Upsert a setting
     * @param {ISettings} setting - The setting to upsert
     * @returns {Promise<ISettings>}
     */
    public async upsertSetting(setting: { [key: string]: any }) : Promise<{ message: string }> {
        const SettingsRepository = Repository.getEntity("SettingsEntity");

        for (const key in setting) {
            const setting = await Repository.findOne(SettingsRepository, { key }, {
                select: [ "group", "key", "value", "type", "flags" ]
            });

            if (setting) {
                await Repository.update(SettingsRepository, setting.id, {
                    value: setting[key]
                });
            }
        }

        return { message: "Settings updated" };
    }
}
