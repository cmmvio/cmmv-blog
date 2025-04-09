"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorProfileContract = void 0;
const core_1 = require("@cmmv/core");
const auth_1 = require("@cmmv/auth");
let AuthorProfileContract = class AuthorProfileContract extends core_1.AbstractContract {
    user;
    name;
    slug;
    image;
    coverImage;
    bio;
    website;
    location;
    facebook;
    twitter;
    instagram;
    linkedin;
    github;
    locale;
    visibility;
    metaTitle;
    metaDescription;
    lastSeen;
    commentNotifications;
    mentionNotifications;
    recommendationNotifications;
};
exports.AuthorProfileContract = AuthorProfileContract;
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        objectType: 'object',
        entityType: 'UserEntity',
        protoRepeated: false,
        nullable: false,
        index: true,
        exclude: true,
        readOnly: true,
        link: [
            {
                createRelationship: true,
                contract: auth_1.UserContract,
                contractName: 'UserContract',
                entityName: 'user',
                field: 'id',
            },
        ],
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "user", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "name", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "slug", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'text',
        nullable: true
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "image", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'text',
        nullable: true
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "coverImage", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'text',
        nullable: true
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "bio", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "website", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "location", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "facebook", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "twitter", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "instagram", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "linkedin", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "github", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true,
        defaultValue: 'en'
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "locale", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true,
        defaultValue: 'public'
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "visibility", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "metaTitle", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], AuthorProfileContract.prototype, "metaDescription", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int64',
        nullable: true
    }),
    __metadata("design:type", Number)
], AuthorProfileContract.prototype, "lastSeen", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'boolean',
        nullable: true,
        defaultValue: true
    }),
    __metadata("design:type", Boolean)
], AuthorProfileContract.prototype, "commentNotifications", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'boolean',
        nullable: true,
        defaultValue: true
    }),
    __metadata("design:type", Boolean)
], AuthorProfileContract.prototype, "mentionNotifications", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'boolean',
        nullable: true,
        defaultValue: true
    }),
    __metadata("design:type", Boolean)
], AuthorProfileContract.prototype, "recommendationNotifications", void 0);
exports.AuthorProfileContract = AuthorProfileContract = __decorate([
    (0, core_1.Contract)({
        namespace: 'Blog',
        controllerName: "Profiles",
        protoPackage: "blog",
        subPath: "/blog",
        generateController: true,
        generateBoilerplates: false,
        auth: true,
        options: {
            moduleContract: true,
            databaseSchemaName: "blog_authors_profiles",
            databaseTimestamps: true
        }
    })
], AuthorProfileContract);
//# sourceMappingURL=author-profile.contract.js.map