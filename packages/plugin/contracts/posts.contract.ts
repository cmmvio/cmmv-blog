import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

import {
    UserContract
} from "@cmmv/auth";

@Contract({
    namespace: 'Blog',
    controllerName: 'Posts',
    protoPackage: 'blog',
    subPath: '/blog',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "blog_posts",
        databaseTimestamps: true
    }
})
export class PostsContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        objectType: 'object',
        entityType: 'UserEntity',
        protoRepeated: false,
        nullable: false,
        index: true,
        exclude: true,
        readOnly: true,
        link: [
            {
                contract: UserContract,
                contractName: 'UserContract',
                entityName: 'user',
                field: 'id',
            },
        ],
    })
    author: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
        validations: [
            {
                type: 'IsString',
                message: 'The title must be a string',
            },
            {
                type: 'MinLength',
                value: 3,
                message: 'The title must be at least 3 characters',
            },
            {
                type: 'MaxLength',
                value: 100,
                message: 'The title must be less than 100 characters',
            },
        ],
    })
    title!: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
        validations: [
            {
                type: 'IsString',
                message: 'The content must be a string',
            },

        ],
    })
    content!: string;


}
