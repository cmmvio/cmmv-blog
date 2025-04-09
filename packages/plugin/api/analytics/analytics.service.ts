import { Service } from '@cmmv/core';

import {
    Repository
} from "@cmmv/repository"

import {
    IAnalyticsAccess
} from './analytics.interface';

@Service("blog_analytics")
export class AnalyticsService {
    constructor(){
        setInterval(() => {
            this.generateReport();
        }, 1000 * 60 * 30);
    }

    /**
     * Registry a new access to the path
     * @param access
     */
    async registryAccess(access: IAnalyticsAccess){
        const AnalyticsAccessEntity = Repository.getEntity("AnalyticsAccessEntity");
        const PostsEntity = Repository.getEntity("PostsEntity");

        const analyticsAccess = new AnalyticsAccessEntity();
        analyticsAccess.path = access.path;
        analyticsAccess.postId = access.postId;
        analyticsAccess.ip = access.ip;
        analyticsAccess.agent = access.agent;
        analyticsAccess.referer = access.referer;
        analyticsAccess.startTime = new Date().getTime();

        if(access.path.includes("post")){
            const post = await Repository.findOne(PostsEntity, {
                slug: access.path.replace("/post/", "")
            }, {
                select: ["id", "views"]
            });

            if(post)
                analyticsAccess.postId = post.id;

            await Repository.updateOne(PostsEntity, Repository.queryBuilder({
                id: post.id
            }), {
                views: post.views + 1
            });
        }

        await Repository.insert(AnalyticsAccessEntity, analyticsAccess);
    }

    /**
     * Registry a new unload to the path
     *
     * @param path url path
     * @param ip ip address
     */
    async registryUnload(path: string, ip: string){
        const AnalyticsAccessEntity = Repository.getEntity("AnalyticsAccessEntity");

        const analyticsAccess = await Repository.findOne(AnalyticsAccessEntity, {
            path, ip,
        }, {
            select: ["id"]
        });

        if(!analyticsAccess)
            return;

        analyticsAccess.endTime = new Date().getTime();

        await Repository.updateOne(AnalyticsAccessEntity, Repository.queryBuilder({
            id: analyticsAccess.id
        }), analyticsAccess);
    }

    /**
     * Generate a report of the analytics
     */
    async generateReport() {
        const AnalyticsAccessEntity = Repository.getEntity("AnalyticsAccessEntity");
        const AnalyticsSummaryEntity = Repository.getEntity("AnalyticsSummaryEntity");

        const analyticsAccess = await Repository.findAll(AnalyticsAccessEntity, {
            summarized: false
        }, [], {
            select: ["id", "path", "ip", "agent", "referer", "startTime", "endTime", "postId"]
        });

        if (!analyticsAccess || analyticsAccess.data.length === 0)
            return true;

        const recordsByDay: Record<string, IAnalyticsAccess[]> = {};

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
            const pathVisits: Record<string, number> = {};
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
            const visitsByIP: Record<string, Set<string>> = {};

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

            const existingSummary = await Repository.findOne(AnalyticsSummaryEntity, {
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
                await Repository.updateOne(
                    AnalyticsSummaryEntity,
                    Repository.queryBuilder({ id: existingSummary.id }),
                    {
                        totalAccess: existingSummary.totalAccess + summaryData.totalAccess,
                        uniqueAccess: Math.max(existingSummary.uniqueAccess, summaryData.uniqueAccess),
                        bounceRate: (existingSummary.bounceRate + summaryData.bounceRate) / 2, // Average the bounce rates
                        avgTimeOnPage: (existingSummary.avgTimeOnPage + summaryData.avgTimeOnPage) / 2 // Average the times
                    }
                );
            } else {
                await Repository.insert(AnalyticsSummaryEntity, summaryData);
            }
        }

        for (const record of analyticsAccess.data) {
            await Repository.updateOne(
                AnalyticsAccessEntity,
                Repository.queryBuilder({ id: record.id }),
                { summarized: true }
            );
        }

        return true;
    }
}
