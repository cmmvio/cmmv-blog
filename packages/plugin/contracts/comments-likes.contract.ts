import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

import {
    CommentsContract
} from "./comments.contract";

import {
    MemberContract
} from "./member.contract";

@Contract({
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
export class CommentsLikesContract extends AbstractContract {
    @ContractField({
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
                contract: CommentsContract,
                entityName: 'comment',
                field: 'id',
            }
        ]
    })
    comment: string;

    @ContractField({
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
                contract: MemberContract,
                entityName: 'member',
                field: 'id',
            }
        ]
    })
    member: string;
}
