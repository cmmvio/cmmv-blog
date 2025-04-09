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
exports.CommentsLikesContract = void 0;
const core_1 = require("@cmmv/core");
const comments_contract_1 = require("./comments.contract");
const member_contract_1 = require("./member.contract");
let CommentsLikesContract = class CommentsLikesContract extends core_1.AbstractContract {
    commentId;
    memberId;
};
exports.CommentsLikesContract = CommentsLikesContract;
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false,
        objectType: 'object',
        entityType: 'CommentsEntity',
        protoRepeated: false,
        exclude: true,
        readOnly: true,
        link: [
            {
                createRelationship: true,
                contract: comments_contract_1.CommentsContract,
                entityName: 'comment',
                field: 'id',
            }
        ]
    }),
    __metadata("design:type", String)
], CommentsLikesContract.prototype, "commentId", void 0);
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
], CommentsLikesContract.prototype, "memberId", void 0);
exports.CommentsLikesContract = CommentsLikesContract = __decorate([
    (0, core_1.Contract)({
        namespace: 'Blog',
        controllerName: 'CommentsLikes',
        protoPackage: 'blog',
        subPath: '/blog',
        generateController: false,
        generateBoilerplates: false,
        auth: true,
        options: {
            moduleContract: true,
            databaseSchemaName: "blog_comments_likes",
            databaseTimestamps: true
        }
    })
], CommentsLikesContract);
//# sourceMappingURL=comments-likes.contract.js.map