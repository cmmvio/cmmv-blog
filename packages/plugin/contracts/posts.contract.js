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
exports.PostsContract = void 0;
const core_1 = require("@cmmv/core");
const auth_1 = require("@cmmv/auth");
const categories_contract_1 = require("./categories.contract");
let PostsContract = class PostsContract extends core_1.AbstractContract {
    author;
    authors;
    title;
    excerpt;
    content;
    categories;
    slug;
    metaTitle;
    metaDescription;
    metaKeywords;
    publishedAt;
    autoPublishAt;
    image;
    featured;
    featureImage;
    featureImageAlt;
    featureImageCaption;
    tags;
    type;
    status;
    visibility;
    codeInjectionHead;
    codeInjectionBody;
    canonicalUrl;
    views;
    comments;
};
exports.PostsContract = PostsContract;
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
                contract: auth_1.UserContract,
                contractName: 'UserContract',
                entityName: 'user',
                field: 'id',
            },
        ],
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "author", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'array',
        nullable: false,
        objectType: 'string',
        entityType: 'UserContract',
        protoRepeated: true,
    }),
    __metadata("design:type", Array)
], PostsContract.prototype, "authors", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false,
        validations: [
            {
                type: 'IsString',
                message: 'The title must be a string',
            },
            {
                type: 'MinLength',
                value: 3,
                message: 'The title must be at least 3 characters',
            },
            {
                type: 'MaxLength',
                value: 100,
                message: 'The title must be less than 100 characters',
            },
        ],
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "title", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true,
        validations: [
            {
                type: 'MaxLength',
                value: 140,
                message: 'The excerpt must be less than 140 characters',
            },
        ],
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "excerpt", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'text',
        nullable: false,
        validations: [
            {
                type: 'IsString',
                message: 'The content must be a string',
            }
        ],
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "content", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'array',
        nullable: false,
        objectType: 'string',
        entityType: 'CategoriesEntity',
        protoRepeated: true,
        exclude: true,
        link: [
            {
                createRelationship: false,
                contract: categories_contract_1.CategoriesContract,
                contractName: 'CategoriesContract',
                entityName: 'category',
                field: 'id',
                array: true
            },
        ],
    }),
    __metadata("design:type", Array)
], PostsContract.prototype, "categories", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false,
        validations: [
            {
                type: 'IsString',
                message: 'The slug must be a string',
            },
        ],
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "slug", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "metaTitle", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "metaDescription", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "metaKeywords", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'datetime',
        nullable: true
    }),
    __metadata("design:type", Date)
], PostsContract.prototype, "publishedAt", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int64',
        nullable: true
    }),
    __metadata("design:type", Number)
], PostsContract.prototype, "autoPublishAt", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "image", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'boolean',
        nullable: false,
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], PostsContract.prototype, "featured", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "featureImage", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "featureImageAlt", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "featureImageCaption", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'array',
        nullable: true,
        objectType: 'string',
        protoRepeated: true,
        array: true
    }),
    __metadata("design:type", Array)
], PostsContract.prototype, "tags", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false,
        defaultValue: 'post'
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "type", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false,
        defaultValue: 'draft'
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "status", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false,
        defaultValue: 'public'
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "visibility", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'text',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "codeInjectionHead", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'text',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "codeInjectionBody", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsContract.prototype, "canonicalUrl", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], PostsContract.prototype, "views", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], PostsContract.prototype, "comments", void 0);
exports.PostsContract = PostsContract = __decorate([
    (0, core_1.Contract)({
        namespace: 'Blog',
        controllerName: 'Posts',
        protoPackage: 'blog',
        subPath: '/blog',
        generateController: true,
        generateBoilerplates: false,
        auth: true,
        options: {
            moduleContract: true,
            databaseSchemaName: "blog_posts",
            databaseTimestamps: true,
            databaseFakeDelete: true
        }
    })
], PostsContract);
//# sourceMappingURL=posts.contract.js.map