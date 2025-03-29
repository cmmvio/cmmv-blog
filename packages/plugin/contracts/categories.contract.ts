import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

export class CategoriesContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false,
    })
    name!: string;
}
