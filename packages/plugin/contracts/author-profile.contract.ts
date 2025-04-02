import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

import {
    UserContract
} from "@cmmv/auth";

@Contract({
    namespace: 'Blog',
    controllerName: "Profiles",
    protoPackage: "blog",
    subPath: "/blog",
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "blog_authors_profiles",
        databaseTimestamps: true
    }
})
export class AuthorProfileContract extends AbstractContract {
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
                createRelationship: true,
                contract: UserContract,
                contractName: 'UserContract',
                entityName: 'user',
                field: 'id',
            },
        ],
    })
    user: string;

    @ContractField({
        protoType: 'string',
        nullable: false
    })
    name!: string;

    @ContractField({
        protoType: 'string',
        nullable: false
    })
    slug!: string;

    @ContractField({
        protoType: 'text',
        nullable: true
    })
    image?: string;

    @ContractField({
        protoType: 'text',
        nullable: true
    })
    coverImage?: string;

    @ContractField({
        protoType: 'text',
        nullable: true
    })
    bio?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    website?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    location?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    facebook?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    twitter?: string;

    @ContractField({
        protoType: 'string',
        nullable: true,
        defaultValue: 'en'
    })
    locale?: string;

    @ContractField({
        protoType: 'string',
        nullable: true,
        defaultValue: 'public'
    })
    visibility?: string;

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

    @ContractField({
        protoType: 'int64',
        nullable: true
    })
    lastSeen?: number;

    @ContractField({
        protoType: 'boolean',
        nullable: true,
        defaultValue: true
    })
    commentNotifications?: boolean;

    @ContractField({
        protoType: 'boolean',
        nullable: true,
        defaultValue: true
    })
    mentionNotifications?: boolean;

    @ContractField({
        protoType: 'boolean',
        nullable: true,
        defaultValue: true
    })
    recommendationNotifications?: boolean;
}
