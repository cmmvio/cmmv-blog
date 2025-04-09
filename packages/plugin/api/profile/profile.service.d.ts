import { AbstractService } from "@cmmv/core";
export declare class BlogProfileService extends AbstractService {
    getProfile(user: any): Promise<any>;
    updateProfile(user: any, profile: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
