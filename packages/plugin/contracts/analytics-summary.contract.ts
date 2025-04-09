import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

@Contract({
    namespace: 'Blog',
    controllerName: 'AnalyticsSummary',
    protoPackage: 'blog',
    subPath: '/blog',
    generateController: false,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "blog_analytics_summary",
        databaseTimestamps: true
    }
})
export class AnalyticsSummaryContract extends AbstractContract {
    @ContractField({
        protoType: 'date',
        nullable: false,
        index: true
    })
    date!: Date;

    @ContractField({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    })
    totalAccess!: number;

    @ContractField({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    })
    uniqueAccess!: number;

    @ContractField({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    })
    bounceRate!: number;

    @ContractField({
        protoType: 'int64',
        nullable: false,
        defaultValue: 0
    })
    avgTimeOnPage!: number;
}