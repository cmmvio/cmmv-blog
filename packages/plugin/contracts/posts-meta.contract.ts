import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

import {
    PostsContract
} from "./posts.contract";

@Contract({
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
export class PostsMetaContract extends AbstractContract {
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
    ogTitle?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    ogDescription?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    ogImage?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    twitterTitle?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    twitterDescription?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    twitterImage?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    metaTitle?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    metaDescription?: string;
}
