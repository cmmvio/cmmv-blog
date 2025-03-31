/**
    **********************************************
    This script was generated automatically by CMMV.
    It is recommended not to modify this file manually,
    as it may be overwritten by the application.
    **********************************************
**/

import { fastJson, AbstractModel } from "@cmmv/core";

import {
    Expose,
    instanceToPlain,
    plainToInstance,
    Type
} from "@cmmv/core";

import {
    IsOptional
} from "@cmmv/core"; 

export interface Iundefined {
    id?: any;

}

//Model
export class undefined extends AbstractModel implements Iundefined {

            @Expose({ toClassOnly: true })
    @IsOptional()
    readonly id!: string;

    constructor(partial: Partial<undefined>) {
        super();
        Object.assign(this, partial);
    }

    public static fromPartial(partial: Partial<undefined>): undefined{
        return plainToInstance(undefined, partial, {
            exposeUnsetFields: false,
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        })
    }

    public static fromEntity(entity: any) : any {
        return this.sanitizeEntity(undefined, entity);
    }

    public toString(){
        return undefinedFastSchema(this);
    }
}

// Schema
export const undefinedFastSchemaStructure = {
    title: "undefined Schema",
    type: "object",
    properties: {
        id: {
            type: "string",
            nullable: false
        },

    },
    required: ["id", ]
};

export const undefinedFastSchema = fastJson(undefinedFastSchemaStructure);

