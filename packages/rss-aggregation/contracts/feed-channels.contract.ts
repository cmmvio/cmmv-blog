import {
    Contract, AbstractContract,
    ContractField, ContractMessage,
    ContractService
} from "@cmmv/core";

@Contract({
    namespace: 'RSSAggregation',
    controllerName: 'FeedChannels',
    protoPackage: 'rss-aggregation',
    subPath: '/rss-aggregation',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "rss_aggregation_feed_channels",
        databaseTimestamps: true
    }
})
export class FeedChannelsContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false,
    })
    name!: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
    })
    url!: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
    })
    rss!: string;

    @ContractField({
        protoType: 'int32',
        nullable: false,
        defaultValue: 1000 * 60 * 60 * 24 // 1 day
    })
    intervalUpdate!: number;
}
