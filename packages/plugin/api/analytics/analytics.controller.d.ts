import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    private parseForm;
    getAnalyticsAccess(ip: string, req: any): Promise<Buffer<ArrayBuffer>>;
    getAnalyticsUnload(ip: string, req: any): Promise<Buffer<ArrayBuffer>>;
    getAnalyticsReport(): Promise<Buffer<ArrayBuffer>>;
}
