import { IAnalyticsAccess } from './analytics.interface';
export declare class AnalyticsService {
    constructor();
    registryAccess(access: IAnalyticsAccess): Promise<void>;
    registryUnload(path: string, ip: string): Promise<void>;
    generateReport(): Promise<boolean>;
}
