import { AbstractContract } from "@cmmv/core";
export declare class MediasContract extends AbstractContract {
    sha1: string;
    filepath: string;
    alt?: string;
    caption?: string;
    format?: string;
    width?: number;
    height?: number;
    size?: number;
}
