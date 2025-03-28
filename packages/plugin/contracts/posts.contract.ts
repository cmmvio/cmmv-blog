import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

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
}
