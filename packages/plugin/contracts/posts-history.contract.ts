import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

import { PostsContract } from "./posts.contract";

@Contract({
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
export class PostsHistoryContract extends AbstractContract {
    @ContractField({
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
                contract: PostsContract,
                entityName: 'post',
                field: 'id',
            },
        ],
    })
    post: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    lexicalContent?: string;

    @ContractField({
        protoType: 'string',
        nullable: false
    })
    authorId!: string;

    @ContractField({
        protoType: 'string',
        nullable: false
    })
    title!: string;

    @ContractField({
        protoType: 'string',
        nullable: false
    })
    postStatus!: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    reason?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    featureImage?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    featureImageAlt?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    featureImageCaption?: string;
}
