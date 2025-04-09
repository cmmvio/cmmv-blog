import { BlogSettingsService } from "./settings.services";
import { ISettings } from "./settings.interface";
export declare class BlogSettingsController {
    private readonly blogSettingsService;
    constructor(blogSettingsService: BlogSettingsService);
    getSetup(setupData: any): Promise<any>;
    getSettings(): Promise<{
        [key: string]: any;
    }>;
    getAllSettings(): Promise<any>;
    getSetting(key: string): Promise<ISettings>;
    updasertSetting(setting: ISettings[]): Promise<{
        message: string;
    }>;
    getRobotsTxt(): Promise<any>;
}
