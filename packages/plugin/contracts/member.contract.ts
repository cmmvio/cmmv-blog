import crypto from 'node:crypto';

import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

@Contract({
    namespace: 'Blog',
    controllerName: 'Member',
    protoPackage: 'blog',
    subPath: '/blog',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "blog_members",
        databaseTimestamps: true
    }
})
export class MemberContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false
    })
    email!: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
        customDecorator: {
            IsStrongPassword: {
                import: '@cmmv/core',
                options: {
                    message: 'Password must be strong',
                },
            },
        },
        validations: [
            {
                type: 'IsString',
                message: 'The password must be a string',
            },
        ],
        afterValidation: (value: string) =>
            crypto.createHash('sha256').update(value).digest('hex'),
    })
    password!: string;

    @ContractField({
        protoType: 'string',
        nullable: false
    })
    name!: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    note?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    getLocation?: string;

    @ContractField({
        protoType: 'int64',
        nullable: true
    })
    emailCount?: number;

    @ContractField({
        protoType: 'int64',
        nullable: true
    })
    emailOpenedCount?: number;

    @ContractField({
        protoType: 'float',
        nullable: true
    })
    emailOpenRate?: number;

    @ContractField({
        protoType: 'boolean',
        nullable: true,
        defaultValue: false
    })
    emailDisabled?: boolean;

    @ContractField({
        protoType: 'date',
        nullable: true
    })
    lastSeenAt?: Date;

    @ContractField({
        protoType: 'date',
        nullable: true
    })
    lastCommentedAt?: Date;
}