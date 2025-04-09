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
exports.PostsHistoryContract = void 0;
const core_1 = require("@cmmv/core");
const posts_contract_1 = require("./posts.contract");
let PostsHistoryContract = class PostsHistoryContract extends core_1.AbstractContract {
    post;
    lexicalContent;
    authorId;
    title;
    postStatus;
    reason;
    featureImage;
    featureImageAlt;
    featureImageCaption;
};
exports.PostsHistoryContract = PostsHistoryContract;
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
], PostsHistoryContract.prototype, "post", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'text',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsHistoryContract.prototype, "lexicalContent", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false
    }),
    __metadata("design:type", String)
], PostsHistoryContract.prototype, "authorId", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false
    }),
    __metadata("design:type", String)
], PostsHistoryContract.prototype, "title", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false
    }),
    __metadata("design:type", String)
], PostsHistoryContract.prototype, "postStatus", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsHistoryContract.prototype, "reason", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsHistoryContract.prototype, "featureImage", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsHistoryContract.prototype, "featureImageAlt", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsHistoryContract.prototype, "featureImageCaption", void 0);
exports.PostsHistoryContract = PostsHistoryContract = __decorate([
    (0, core_1.Contract)({
        namespace: 'Blog',
        controllerName: 'PostsHistory',
        protoPackage: 'blog',
        subPath: '/blog',
        generateController: false,
        generateBoilerplates: false,
        auth: true,
        options: {
            moduleContract: true,
            databaseSchemaName: "blog_posts_history",
            databaseTimestamps: false
        }
    })
], PostsHistoryContract);
//# sourceMappingURL=posts-history.contract.js.map