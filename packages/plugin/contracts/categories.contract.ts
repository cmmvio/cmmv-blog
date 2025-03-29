import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

@Contract({
    namespace: 'Blog',
    controllerName: 'Categories',
    protoPackage: 'blog',
    subPath: '/blog',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "blog_categories",
        databaseTimestamps: true
    }
})
export class CategoriesContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false,
    })
    name!: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    parentCategory!: string;

    @ContractField({
        protoType: 'boolean',
        nullable: false,
        defaultValue: true
    })
    active!: boolean;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    navigationLabel!: string;
}
