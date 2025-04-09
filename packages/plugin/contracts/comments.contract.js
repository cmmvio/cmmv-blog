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
exports.CommentsContract = void 0;
const core_1 = require("@cmmv/core");
const posts_contract_1 = require("./posts.contract");
const member_contract_1 = require("./member.contract");
let CommentsContract = class CommentsContract extends core_1.AbstractContract {
    post;
    member;
    parentId;
    inReplyTo;
    status;
    content;
    editedAt;
};
exports.CommentsContract = CommentsContract;
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false,
        objectType: 'object',
        entityType: 'PostsEntity',
        protoRepeated: false,
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
], CommentsContract.prototype, "post", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false,
        objectType: 'object',
        entityType: 'MemberEntity',
        protoRepeated: false,
        exclude: true,
        readOnly: true,
        link: [
            {
                createRelationship: true,
                contract: member_contract_1.MemberContract,
                entityName: 'member',
                field: 'id',
            }
        ]
    }),
    __metadata("design:type", String)
], CommentsContract.prototype, "member", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], CommentsContract.prototype, "parentId", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], CommentsContract.prototype, "inReplyTo", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false,
        defaultValue: 'published'
    }),
    __metadata("design:type", String)
], CommentsContract.prototype, "status", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'text',
        nullable: false
    }),
    __metadata("design:type", String)
], CommentsContract.prototype, "content", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'date',
        nullable: true
    }),
    __metadata("design:type", Date)
], CommentsContract.prototype, "editedAt", void 0);
exports.CommentsContract = CommentsContract = __decorate([
    (0, core_1.Contract)({
        namespace: 'Blog',
        controllerName: 'Comments',
        protoPackage: 'blog',
        subPath: '/blog',
        generateController: false,
        generateBoilerplates: false,
        auth: true,
        options: {
            moduleContract: true,
            databaseSchemaName: "blog_comments",
            databaseTimestamps: true,
            databaseFakeDelete: true
        }
    })
], CommentsContract);
//# sourceMappingURL=comments.contract.js.map