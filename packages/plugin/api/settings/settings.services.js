"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogSettingsService = void 0;
const crypto = require("crypto");
const core_1 = require("@cmmv/core");
const repository_1 = require("@cmmv/repository");
let BlogSettingsService = class BlogSettingsService {
    async getSetup(setupData) {
        const SettingsRepository = repository_1.Repository.getEntity("SettingsEntity");
        const settings = await repository_1.Repository.findOne(SettingsRepository, { key: "setupFinish" }, {
            select: ["group", "key", "value", "type", "flags"]
        });
        console.log(settings);
        if (settings && settings.value === "true")
            throw new Error("Setup already finished");
        const UserEntity = repository_1.Repository.getEntity("UserEntity");
        const adminExists = await repository_1.Repository.findOne(UserEntity, { root: true });
        if (adminExists)
            throw new Error("Admin account already exists");
        const usernameHashed = crypto
            .createHash('sha1')
            .update(setupData.admin.email)
            .digest('hex');
        const passwordHashed = crypto
            .createHash('sha256')
            .update(setupData.admin.password)
            .digest('hex');
        const user = await repository_1.Repository.insert(UserEntity, {
            root: true,
            email: setupData.admin.email,
            username: usernameHashed,
            password: passwordHashed,
            validated: true,
            blocked: false
        });
        if (!user)
            throw new Error("Failed to create admin account");
        for (const key in setupData.blog) {
            const autorizedSettings = ["title", "description", "url"];
            if (!autorizedSettings.includes(key))
                throw new Error(`Invalid blog setting: ${key}`);
            await repository_1.Repository.insert(SettingsRepository, {
                group: "blog",
                key: `blog.${key.toLowerCase()}`,
                value: setupData.blog[key],
                type: "string",
                flags: ["PUBLIC"]
            });
        }
        for (const key in setupData.settings) {
            const autorizedSettings = ["postsPerPage", "enableComments", "moderateComments", "language", "timezone"];
            const fieldsTypes = {
                postsPerPage: "number",
                enableComments: "boolean",
                moderateComments: "boolean",
                language: "string",
                timezone: "string"
            };
            const type = fieldsTypes[key];
            if (!autorizedSettings.includes(key))
                throw new Error(`Invalid settings setting: ${key}`);
            await repository_1.Repository.insert(SettingsRepository, {
                group: "blog",
                key: `blog.${key.toLowerCase()}`,
                value: setupData.settings[key],
                type: type,
                flags: ["PUBLIC"]
            });
        }
        await repository_1.Repository.insert(SettingsRepository, {
            group: "blog",
            key: "setupFinish",
            value: "true",
            type: "boolean",
            flags: ["PUBLIC"]
        });
        return { message: "Setup finished" };
    }
    async getSettings() {
        const SettingsRepository = repository_1.Repository.getEntity("SettingsEntity");
        let settingsResult = {};
        const settings = await repository_1.Repository.findAll(SettingsRepository, {
            limit: 1000
        }, [], {
            select: ["group", "key", "value", "type", "flags"]
        });
        if (settings) {
            for (const setting of settings.data) {
                if (setting.flags.includes("PUBLIC")) {
                    settingsResult[setting.key] = setting.value;
                    switch (setting.type) {
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
    async getAllSettings() {
        const SettingsRepository = repository_1.Repository.getEntity("SettingsEntity");
        const settings = await repository_1.Repository.findAll(SettingsRepository, {
            limit: 1000
        }, [], {
            select: ["group", "key", "value", "type", "flags"]
        });
        return settings ? settings : [];
    }
    async getSetting(key) {
        const SettingsRepository = repository_1.Repository.getEntity("SettingsEntity");
        const setting = await repository_1.Repository.findOne(SettingsRepository, { key }, {
            select: ["group", "key", "value", "type", "flags"]
        });
        if (!setting.data.flags.includes("PUBLIC"))
            throw new Error("Setting not found");
        return setting ? setting.data : null;
    }
    async upsertSetting(settings) {
        const SettingsRepository = repository_1.Repository.getEntity("SettingsEntity");
        for (const setting of settings) {
            const settingStoraged = await repository_1.Repository.findOne(SettingsRepository, { key: setting.key }, {
                select: ["group", "key", "value", "type", "flags"]
            });
            if (settingStoraged) {
                await repository_1.Repository.updateOne(SettingsRepository, { key: setting.key }, {
                    value: setting.value
                });
            }
            else {
                await repository_1.Repository.insert(SettingsRepository, {
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
};
exports.BlogSettingsService = BlogSettingsService;
exports.BlogSettingsService = BlogSettingsService = __decorate([
    (0, core_1.Service)("blog_settings")
], BlogSettingsService);
//# sourceMappingURL=settings.services.js.map