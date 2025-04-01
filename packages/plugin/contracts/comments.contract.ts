import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

import {
    PostsContract
} from "./posts.contract";

import {
    MemberContract
} from "./member.contract";

@Contract({
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
export class CommentsContract extends AbstractContract {
    @ContractField({
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
                contract: PostsContract,
                entityName: 'post',
                field: 'id',
            },
        ],
    })
    post: string;

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

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    parentId?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    inReplyTo?: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
        defaultValue: 'published'
    })
    status: string;

    @ContractField({
        protoType: 'text',
        nullable: false
    })
    content!: string;

    @ContractField({
        protoType: 'date',
        nullable: true
    })
    editedAt?: Date;
}
