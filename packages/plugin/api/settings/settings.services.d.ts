import { ISettings, ISetup } from "./settings.interface";
export declare class BlogSettingsService {
    getSetup(setupData: ISetup): Promise<any>;
    getSettings(): Promise<{
        [key: string]: any;
    }>;
    getAllSettings(): Promise<any>;
    getSetting(key: string): Promise<ISettings | null>;
    upsertSetting(settings: ISettings[]): Promise<{
        message: string;
    }>;
}
