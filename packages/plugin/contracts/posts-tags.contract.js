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
exports.PostsTagsContract = void 0;
const core_1 = require("@cmmv/core");
let PostsTagsContract = class PostsTagsContract extends core_1.AbstractContract {
    name;
    slug;
    navigationLabel;
    description;
    postCount;
};
exports.PostsTagsContract = PostsTagsContract;
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false,
        unique: true
    }),
    __metadata("design:type", String)
], PostsTagsContract.prototype, "name", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false
    }),
    __metadata("design:type", String)
], PostsTagsContract.prototype, "slug", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsTagsContract.prototype, "navigationLabel", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], PostsTagsContract.prototype, "description", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int32',
        nullable: true,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], PostsTagsContract.prototype, "postCount", void 0);
exports.PostsTagsContract = PostsTagsContract = __decorate([
    (0, core_1.Contract)({
        namespace: 'Blog',
        controllerName: 'Tags',
        protoPackage: 'blog',
        subPath: '/blog',
        generateController: true,
        generateBoilerplates: false,
        auth: true,
        options: {
            moduleContract: true,
            databaseSchemaName: "blog_posts_tags",
            databaseTimestamps: true
        }
    })
], PostsTagsContract);
//# sourceMappingURL=posts-tags.contract.js.map