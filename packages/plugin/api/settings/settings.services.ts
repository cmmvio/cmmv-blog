import * as crypto from "crypto";

import {
    Service
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

import {
    ISettings,
    ISetup
} from "./settings.interface";

@Service("blog_settings")
export class BlogSettingsService {
    /**
     * Get the setup data
     * @param setupData - The setup data
     * @returns {Promise<any>}
     */
    public async getSetup(setupData: ISetup) : Promise<any> {
        const SettingsRepository = Repository.getEntity("SettingsEntity");

        const settings = await Repository.findOne(SettingsRepository, { key: "setupFinish" }, {
            select: [ "group", "key", "value", "type", "flags" ]
        });

        if(settings && settings.value === "true")
            throw new Error("Setup already finished");

        const UserEntity = Repository.getEntity("UserEntity");
        const adminExists = await Repository.findOne(UserEntity, { root: true })

        if(adminExists)
            throw new Error("Admin account already exists");

        const usernameHashed = crypto
            .createHash('sha1')
            .update(setupData.admin.email)
            .digest('hex');

        const passwordHashed = crypto
            .createHash('sha256')
            .update(setupData.admin.password)
            .digest('hex');

        const user = await Repository.insert(UserEntity, {
            root: true,
            email: setupData.admin.email,
            username: usernameHashed,
            password: passwordHashed,
            validated: true,
            blocked: false
        });

        if(!user)
            throw new Error("Failed to create admin account");

        for(const key in setupData.blog) {
            const autorizedSettings = ["title", "description", "url"];

            if(!autorizedSettings.includes(key))
                throw new Error(`Invalid blog setting: ${key}`);

            await Repository.insert(SettingsRepository, {
                group: "blog",
                key: `blog.${key.toLowerCase()}`,
                value: setupData.blog[key as keyof typeof setupData.blog],
                type: "string",
                flags: ["PUBLIC"]
            });
        }

        for(const key in setupData.settings) {
            const autorizedSettings = ["postsPerPage", "enableComments", "moderateComments", "language", "timezone"];
            const fieldsTypes = {
                postsPerPage: "number",
                enableComments: "boolean",
                moderateComments: "boolean",
                language: "string",
                timezone: "string"
            }
            const type = fieldsTypes[key as keyof typeof fieldsTypes];

            if(!autorizedSettings.includes(key))
                throw new Error(`Invalid settings setting: ${key}`);

            await Repository.insert(SettingsRepository, {
                group: "blog",
                key: `blog.${key.toLowerCase()}`,
                value: setupData.settings[key as keyof typeof setupData.settings],
                type: type,
                flags: ["PUBLIC"]
            });
        }

        await Repository.insert(SettingsRepository, {
            group: "blog",
            key: "setupFinish",
            value: "true",
            type: "boolean",
            flags: ["PUBLIC"]
        });

        return { message: "Setup finished" };
    }

    /**
     * Get all settings
     * @returns {Promise<any>}
     */
    public async getSettings() : Promise<{ [key: string]: any }> {
        const SettingsRepository = Repository.getEntity("SettingsEntity");
        let settingsResult: { [key: string]: any } = {};

        const settings = await Repository.findAll(SettingsRepository, {
            limit: 1000
        }, [], {
            select: [ "group", "key", "value", "type", "flags" ]
        });

        if(settings) {
            for(const setting of settings.data) {
                if(setting.flags.includes("PUBLIC")){
                    settingsResult[setting.key] = setting.value;

                    switch(setting.type) {
                        case "boolean":
                            settingsResult[setting.key] = setting.value === "true";
                            break;
                        case "number":
                            settingsResult[setting.key] = parseInt(setting.value);
                            break;
                        case "string":
                            settingsResult[setting.key] = setting.value;
                            break;
                    }
                }
            }
        }

        return settingsResult;
    }

    /**
     * Get all settings
     * @returns {Promise<ISettings[]>}
     */
    public async getAllSettings() : Promise<any> {
        const SettingsRepository = Repository.getEntity("SettingsEntity");

        const settings = await Repository.findAll(SettingsRepository, {
            limit: 1000
        }, [], {
            select: [ "group", "key", "value", "type", "flags" ]
        });

        return settings ? settings : [];
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

        if(!setting.data.flags.includes("PUBLIC"))
            throw new Error("Setting not found");

        return setting ? setting.data : null;
    }

    /**
     * Upsert a setting
     * @param {ISettings} setting - The setting to upsert
     * @returns {Promise<ISettings>}
     */
    public async upsertSetting(settings: ISettings[]) : Promise<{ message: string }> {
        const SettingsRepository = Repository.getEntity("SettingsEntity");

        for (const setting of settings) {
            const settingStoraged = await Repository.findOne(SettingsRepository, { key: setting.key }, {
                select: [ "group", "key", "value", "type", "flags" ]
            });

            if (settingStoraged) {
                await Repository.updateOne(SettingsRepository, { key: setting.key }, {
                    value: setting.value
                });
            }
            else {
                await Repository.insert(SettingsRepository, {
                    group: "blog",
                    key: setting.key,
                    value: setting.value,
                    type: setting.type,
                    flags: setting.flags
                });
            }
        }

        return { message: "Settings updated" };
    }
}
