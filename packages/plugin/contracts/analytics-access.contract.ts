import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

@Contract({
    namespace: 'Blog',
    controllerName: 'AnalyticsAccess',
    protoPackage: 'blog',
    subPath: '/blog',
    generateController: false,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "blog_analytics_access",
        databaseTimestamps: true
    }
})
export class AnalyticsAccessContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false
    })
    path!: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    postId?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    ip?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    agent?: string;

    @ContractField({
        protoType: 'string',
        nullable: true
    })
    referer?: string;

    @ContractField({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    })
    startTime!: number;

    @ContractField({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    })
    endTime!: number;

    @ContractField({
        protoType: 'boolean',
        nullable: false,
        defaultValue: false,
        index: true
    })
    summarized!: boolean;
}