import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

@Contract({
    namespace: 'Blog',
    controllerName: 'Redirects',
    protoPackage: 'blog',
    subPath: '/blog',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "blog_redirects"
    }
})
export class RedirectsContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false,
        index: true,
        unique: true
    })
    oldSlug!: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
    })
    redirectUrl!: string;

    @ContractField({
        protoType: 'int32',
        nullable: false,
        defaultValue: 304
    })
    codeStatus!: number;

    @ContractField({
        protoType: 'string',
        nullable: true,
        index: true,
        unique: true
    })
    refererId?: string;
}
