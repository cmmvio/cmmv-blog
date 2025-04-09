"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const core_1 = require("@cmmv/core");
const repository_1 = require("@cmmv/repository");
let AnalyticsService = class AnalyticsService {
    constructor() {
        setInterval(() => {
            this.generateReport();
        }, 1000 * 60 * 30);
    }
    async registryAccess(access) {
        const AnalyticsAccessEntity = repository_1.Repository.getEntity("AnalyticsAccessEntity");
        const PostsEntity = repository_1.Repository.getEntity("PostsEntity");
        const analyticsAccess = new AnalyticsAccessEntity();
        analyticsAccess.path = access.path;
        analyticsAccess.postId = access.postId;
        analyticsAccess.ip = access.ip;
        analyticsAccess.agent = access.agent;
        analyticsAccess.referer = access.referer;
        analyticsAccess.startTime = new Date().getTime();
        if (access.path.includes("post")) {
            const post = await repository_1.Repository.findOne(PostsEntity, {
                slug: access.path.replace("/post/", "")
            }, {
                select: ["id", "views"]
            });
            if (post)
                analyticsAccess.postId = post.id;
            await repository_1.Repository.updateOne(PostsEntity, repository_1.Repository.queryBuilder({
                id: post.id
            }), {
                views: post.views + 1
            });
        }
        await repository_1.Repository.insert(AnalyticsAccessEntity, analyticsAccess);
    }
    async registryUnload(path, ip) {
        const AnalyticsAccessEntity = repository_1.Repository.getEntity("AnalyticsAccessEntity");
        const analyticsAccess = await repository_1.Repository.findOne(AnalyticsAccessEntity, {
            path, ip,
        }, {
            select: ["id"]
        });
        if (!analyticsAccess)
            return;
        analyticsAccess.endTime = new Date().getTime();
        await repository_1.Repository.updateOne(AnalyticsAccessEntity, repository_1.Repository.queryBuilder({
            id: analyticsAccess.id
        }), analyticsAccess);
    }
    async generateReport() {
        const AnalyticsAccessEntity = repository_1.Repository.getEntity("AnalyticsAccessEntity");
        const AnalyticsSummaryEntity = repository_1.Repository.getEntity("AnalyticsSummaryEntity");
        const analyticsAccess = await repository_1.Repository.findAll(AnalyticsAccessEntity, {
            summarized: false
        }, [], {
            select: ["id", "path", "ip", "agent", "referer", "startTime", "endTime", "postId"]
        });
        if (!analyticsAccess || analyticsAccess.data.length === 0)
            return true;
        const recordsByDay = {};
        for (const record of analyticsAccess.data) {
            const date = new Date(record.startTime);
            const day = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            if (!recordsByDay[day])
                recordsByDay[day] = [];
            recordsByDay[day].push(record);
        }
        for (const day in recordsByDay) {
            const records = recordsByDay[day];
            const uniqueIPs = new Set();
            const uniquePaths = new Set();
            const pathVisits = {};
            let totalTimeOnPage = 0;
            let recordsWithTime = 0;
            for (const record of records) {
                uniqueIPs.add(record.ip);
                uniquePaths.add(record.path);
                if (!pathVisits[record.path])
                    pathVisits[record.path] = 0;
                pathVisits[record.path]++;
                if (record.endTime && record.startTime && record.endTime > record.startTime) {
                    const timeOnPage = record.endTime - record.startTime;
                    if (timeOnPage > 0 && timeOnPage < 3600000) {
                        totalTimeOnPage += timeOnPage;
                        recordsWithTime++;
                    }
                }
            }
            const totalVisitors = uniqueIPs.size;
            let bounceCount = 0;
            const visitsByIP = {};
            for (const record of records) {
                if (record.ip) {
                    if (!visitsByIP[record.ip]) {
                        visitsByIP[record.ip] = new Set();
                    }
                    visitsByIP[record.ip].add(record.path);
                }
            }
            for (const ip in visitsByIP) {
                if (visitsByIP[ip].size === 1) {
                    bounceCount++;
                }
            }
            const bounceRate = totalVisitors > 0 ? Math.round((bounceCount / totalVisitors) * 100) : 0;
            const avgTimeOnPage = recordsWithTime > 0 ? Math.round(totalTimeOnPage / recordsWithTime / 1000) : 0;
            const existingSummary = await repository_1.Repository.findOne(AnalyticsSummaryEntity, {
                date: day
            });
            const summaryData = {
                date: day,
                totalAccess: records.length,
                uniqueAccess: uniqueIPs.size,
                bounceRate: bounceRate,
                avgTimeOnPage: avgTimeOnPage
            };
            if (existingSummary) {
                await repository_1.Repository.updateOne(AnalyticsSummaryEntity, repository_1.Repository.queryBuilder({ id: existingSummary.id }), {
                    totalAccess: existingSummary.totalAccess + summaryData.totalAccess,
                    uniqueAccess: Math.max(existingSummary.uniqueAccess, summaryData.uniqueAccess),
                    bounceRate: (existingSummary.bounceRate + summaryData.bounceRate) / 2,
                    avgTimeOnPage: (existingSummary.avgTimeOnPage + summaryData.avgTimeOnPage) / 2
                });
            }
            else {
                await repository_1.Repository.insert(AnalyticsSummaryEntity, summaryData);
            }
        }
        for (const record of analyticsAccess.data) {
            await repository_1.Repository.updateOne(AnalyticsAccessEntity, repository_1.Repository.queryBuilder({ id: record.id }), { summarized: true });
        }
        return true;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, core_1.Service)("blog_analytics"),
    __metadata("design:paramtypes", [])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map