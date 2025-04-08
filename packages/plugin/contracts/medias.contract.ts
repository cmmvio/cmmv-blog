import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

@Contract({
    namespace: 'Blog',
    controllerName: 'Medias',
    protoPackage: 'blog',
    subPath: '/blog',
    generateController: false,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "blog_medias",
        databaseTimestamps: true
    }
})
export class MediasContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false
    })
    sha1!: string;

    @ContractField({
        protoType: 'string',
        nullable: false
    })
    filepath!: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    alt?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    caption?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    format?: string;

    @ContractField({
        protoType: 'number',
        nullable: true
    })
    width?: number;

    @ContractField({
        protoType: 'number',
        nullable: true
    })
    height?: number;

    @ContractField({
        protoType: 'int32',
        nullable: true
    })
    size?: number;
}