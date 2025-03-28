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

export interface IPosts {
    id?: any;

}

//Model
export class Posts extends AbstractModel implements IPosts {

            @Expose({ toClassOnly: true })
    @IsOptional()
    readonly id!: string;

    constructor(partial: Partial<Posts>) {
        super();
        Object.assign(this, partial);
    }

    public static fromPartial(partial: Partial<Posts>): Posts{
        return plainToInstance(Posts, partial, {
            exposeUnsetFields: false,
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        })
    }

    public static fromEntity(entity: any) : any {
        return this.sanitizeEntity(Posts, entity);
    }

    public toString(){
        return PostsFastSchema(this);
    }
}

// Schema
export const PostsFastSchemaStructure = {
    title: "Posts Schema",
    type: "object",
    properties: {
        id: {
            type: "string",
            nullable: false
        },

    },
    required: ["id", ]
};

export const PostsFastSchema = fastJson(PostsFastSchemaStructure);

