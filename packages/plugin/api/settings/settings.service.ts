import * as crypto from "crypto";
import * as path from "path";
import * as fs from "fs";

import {
    Service, Config
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

import {
    ISettings,
    ISetup
} from "./settings.interface";

// Define sensitive keys that should always be PRIVATE
const SENSITIVE_KEYS = [
    // API Keys
    "blog.youtubeApiKey",
    "blog.twitterBearerToken",
    "blog.redditClientId",
    "blog.redditClientSecret",
    "blog.redditUsername",
    "blog.redditPassword",
    // AI API Keys
    "blog.geminiApiKey",
    "blog.openaiApiKey",
    "blog.grokApiKey",
    "blog.deepseekApiKey",
    // Authentication tokens
    "blog.facebookAccessToken",
    "blog.twitterApiKey",
    "blog.twitterApiSecret",
    "blog.twitterAccessToken",
    "blog.twitterAccessTokenSecret",
    "blog.linkedInAccessToken",
    // Email settings
    "blog.smtpPassword",
    "blog.awsSecretKey",
    // Twilio settings
    "blog.twilioAuthToken",
    // Analytics and verification
    "blog.googleAnalyticsId",
    "blog.adminEmail",
    "blog.cloudflareToken",
    "blog.cloudflareZoneId",
    "blog.cloudfrontAccessKey",
    "blog.cloudfrontSecretKey",
    "blog.cloudfrontDistributionId",
    "blog.cloudfrontRegion",
    "blog.autoPurgeCache",
    // OneSignal settings
    "blog.oneSignalAppId",
    "blog.oneSignalApiKey",
    "blog.oneSignalSafariWebId",
    // AdSense settings
    "blog.twilioAccountSid",
    "blog.twilioAuthToken",
    "blog.twilioFromNumber",
    "blog.twilioAdminNumber",
    // Indexing settings
    "blog.googleIndexingApiKey",
    "blog.googleIndexingServiceAccount",
];

@Service("blog_settings")
export class SettingsService {
    /**
     * Get the setup data
     * @param setupData - The setup data
     * @returns {Promise<any>}
     */
    public async getSetup(setupData: ISetup) : Promise<any> {
        const apiEnv = path.join(__dirname, "../../../../apps/api/.env");
        const webEnv = path.join(__dirname, "../../../../apps/web/.env");

        const signature = crypto
            .createHash('sha256')
            .update(new Date().getTime().toString())
            .digest('hex');

        await fs.writeFileSync(apiEnv, `API_URL="${setupData.settings.apiUrl}"
API_SIGNATURE="${signature}"
        `);

        await fs.writeFileSync(webEnv, `VITE_API_URL="${setupData.settings.apiUrl}"
VITE_WEBSITE_URL="${setupData.blog.url}"
VITE_API_URL_FRONT="${setupData.settings.frontendApiUrl}"
VITE_SSR="true"
VITE_SSR_PORT="${setupData.settings.basePort + 1}"
VITE_ALLOWED_HOSTS="${setupData.settings.allowedHosts.join(",")}"
VITE_SIGNATURE="${signature}"
VITE_DEFAULT_THEME="default"
        `);

        const SettingsRepository = Repository.getEntity("SettingsEntity");

        const settings = await Repository.findOne(SettingsRepository, { key: "setupFinish" }, {
            select: [ "group", "key", "value", "type", "flags" ]
        });

        if(settings && settings.value === "true")
            throw new Error("Setup already finished");

        const UserEntity = Repository.getEntity("UserEntity");
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");
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

        await Repository.insert(ProfilesEntity, {
            user: user.data.id,
            name: "Admin",
            slug: "admin",
            email: setupData.admin.email
        });

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
                // Only include PUBLIC settings and exclude sensitive keys
                if(setting.flags.includes("PUBLIC") && !SENSITIVE_KEYS.includes(setting.key)){
                    settingsResult[setting.key] = setting.value;

                    switch(setting.type) {
                        case "boolean":
                            settingsResult[setting.key] = setting.value === "true" || setting.value === "1";
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

        if(!setting)
            return null;

        // Don't return sensitive keys or private settings
        if(!setting.flags.includes("PUBLIC") || SENSITIVE_KEYS.includes(setting.key))
            return null;

        return setting ? setting : null;
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

            // Determine if this is a sensitive key
            const isSensitive = SENSITIVE_KEYS.includes(setting.key);
            const flags = isSensitive ? ["PRIVATE"] : (setting.flags || ["PUBLIC"]);

            if (settingStoraged) {
                await Repository.updateOne(SettingsRepository, { key: setting.key }, {
                    value: setting.value,
                    flags: flags // Update flags in case a setting needs to be changed to PRIVATE
                });
            }
            else {
                await Repository.insert(SettingsRepository, {
                    group: "blog",
                    key: setting.key,
                    value: setting.value,
                    type: setting.type || typeof setting.value,
                    flags: flags
                });
            }
        }

        return { message: "Settings updated" };
    }

    /**
     * Update a setting
     * @param key - The key of the setting
     * @param value - The value of the setting
     * @returns {Promise<{ message: string }>}
     */
    public async updateSetting(key: string, value: any) {
        const SettingsRepository = Repository.getEntity("SettingsEntity");

        // Determine if this is a sensitive key
        const isSensitive = SENSITIVE_KEYS.includes(key);
        const flags = isSensitive ? ["PRIVATE"] : ["PUBLIC"];

        const settingTheme = await Repository.findOne(SettingsRepository, { key }, {
            select: [ "key", "flags" ]
        });

        Config.set(key, value);

        if(settingTheme){
            await Repository.updateOne(SettingsRepository, { key }, {
                value,
                flags: settingTheme.flags.includes("PRIVATE") || isSensitive ? ["PRIVATE"] : flags
            });
        }
        else{
            await Repository.insert(SettingsRepository, {
                group: "blog",
                key,
                value,
                type: typeof value === 'string' ? "string" : typeof value === 'number' ? "number" : typeof value === 'boolean' ? "boolean" : "string",
                flags: flags
            });
        }

        return { message: "Setting updated" };
    }
}
