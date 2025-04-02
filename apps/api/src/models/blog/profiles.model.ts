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
    IsOptional,
    IsNotEmpty
} from "@cmmv/core"; 

export interface IProfiles {
    id?: any;
    name: string;
    slug: string;
    image?: string;
    coverImage?: string;
    bio?: string;
    website?: string;
    location?: string;
    facebook?: string;
    twitter?: string;
    locale?: string;
    visibility?: string;
    metaTitle?: string;
    metaDescription?: string;
    lastSeen?: number;
    commentNotifications?: boolean;
    mentionNotifications?: boolean;
    recommendationNotifications?: boolean;
}

//Model
export class Profiles extends AbstractModel implements IProfiles {

            @Expose({ toClassOnly: true })
    @IsOptional()
    readonly id!: string;

    @Expose()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsNotEmpty()
    slug: string;

    @Expose()
    image?: string;

    @Expose()
    coverImage?: string;

    @Expose()
    bio?: string;

    @Expose()
    website?: string;

    @Expose()
    location?: string;

    @Expose()
    facebook?: string;

    @Expose()
    twitter?: string;

    @Expose()
    locale?: string = "en";

    @Expose()
    visibility?: string = "public";

    @Expose()
    metaTitle?: string;

    @Expose()
    metaDescription?: string;

    @Expose()
    lastSeen?: number;

    @Expose()
    commentNotifications?: boolean = true;

    @Expose()
    mentionNotifications?: boolean = true;

    @Expose()
    recommendationNotifications?: boolean = true;

    constructor(partial: Partial<Profiles>) {
        super();
        Object.assign(this, partial);
    }

    public static fromPartial(partial: Partial<Profiles>): Profiles{
        return plainToInstance(Profiles, partial, {
            exposeUnsetFields: false,
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        })
    }

    public static fromEntity(entity: any) : any {
        return this.sanitizeEntity(Profiles, entity);
    }

    public toString(){
        return ProfilesFastSchema(this);
    }
}

// Schema
export const ProfilesFastSchemaStructure = {
    title: "Profiles Schema",
    type: "object",
    properties: {
        id: {
            type: "string",
            nullable: false
        },
        name: {
            type: "string",
            nullable: false
        },
        slug: {
            type: "string",
            nullable: false
        },
        image: {
            type: "string",
            nullable: true
        },
        coverImage: {
            type: "string",
            nullable: true
        },
        bio: {
            type: "string",
            nullable: true
        },
        website: {
            type: "string",
            nullable: true
        },
        location: {
            type: "string",
            nullable: true
        },
        facebook: {
            type: "string",
            nullable: true
        },
        twitter: {
            type: "string",
            nullable: true
        },
        locale: {
            type: "string",
            nullable: true,
            default: "en"
        },
        visibility: {
            type: "string",
            nullable: true,
            default: "public"
        },
        metaTitle: {
            type: "string",
            nullable: true
        },
        metaDescription: {
            type: "string",
            nullable: true
        },
        lastSeen: {
            type: "number",
            nullable: true
        },
        commentNotifications: {
            type: "boolean",
            nullable: true,
            default: true
        },
        mentionNotifications: {
            type: "boolean",
            nullable: true,
            default: true
        },
        recommendationNotifications: {
            type: "boolean",
            nullable: true,
            default: true
        }
    },
    required: ["id", "name", "slug"]
};

export const ProfilesFastSchema = fastJson(ProfilesFastSchemaStructure);

