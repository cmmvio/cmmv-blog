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
exports.PostsMetaContract = void 0;
const core_1 = require("@cmmv/core");
const posts_contract_1 = require("./posts.contract");
let PostsMetaContract = class PostsMetaContract extends core_1.AbstractContract {
    post;
    ogTitle;
    ogDescription;
    ogImage;
    twitterTitle;
    twitterDescription;
    twitterImage;
    metaTitle;
    metaDescription;
};
exports.PostsMetaContract = PostsMetaContract;
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        objectType: 'object',
        entityType: 'PostsEntity',
        protoRepeated: false,
        nullable: false,
        index: true,
        exclude: true,
        readOnly: true,
        link: [
            {
                createRelationship: true,
                contract: posts_contract_1.PostsContract,
                entityName: 'post',
                field: 'id',
            },
        ],
    }),
    __metadata("design:type", String)
], PostsMetaContract.prototype, "post", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsMetaContract.prototype, "ogTitle", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsMetaContract.prototype, "ogDescription", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsMetaContract.prototype, "ogImage", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsMetaContract.prototype, "twitterTitle", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsMetaContract.prototype, "twitterDescription", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsMetaContract.prototype, "twitterImage", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsMetaContract.prototype, "metaTitle", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsMetaContract.prototype, "metaDescription", void 0);
exports.PostsMetaContract = PostsMetaContract = __decorate([
    (0, core_1.Contract)({
        namespace: 'Blog',
        controllerName: 'Meta',
        protoPackage: 'blog',
        subPath: '/blog',
        generateController: false,
        generateBoilerplates: false,
        auth: true,
        options: {
            moduleContract: true,
            databaseSchemaName: "blog_posts_meta",
            databaseTimestamps: false
        }
    })
], PostsMetaContract);
//# sourceMappingURL=posts-meta.contract.js.map