import {
    Contract, AbstractContract,
    ContractField, ContractMessage,
    ContractService
} from "@cmmv/core";

@Contract({
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
export class PostsTagsContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false,
        unique: true
    })
    name!: string;

    @ContractField({
        protoType: 'string',
        nullable: false
    })
    slug!: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    navigationLabel?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    description?: string;

    @ContractField({
        protoType: 'int32',
        nullable: true,
        defaultValue: 0
    })
    postCount!: number;
}
