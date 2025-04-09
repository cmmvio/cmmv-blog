export interface IAnalyticsAccess {
    path: string;
    postId?: string;
    ip?: string;
    agent?: string;
    referer?: string;
    startTime: number;
    endTime: number;
}
export interface IBeaconPayload {
    path: string;
    t: number;
    r: number;
}
