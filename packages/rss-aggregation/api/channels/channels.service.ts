import * as xml2js from 'xml2js';

import {
    Service, Cron,
    CronExpression
} from "@cmmv/core";

import {
    Repository, LessThan
} from "@cmmv/repository";

import {
    ParserService
} from "../parser/parser.service";

interface RssItem {
    link: string;
    title: string;
    content?: string;
    'media:content'?: { $?: { url?: string }, url?: string };
    enclosure?: { $?: { url?: string }, url?: string };
    pubDate?: string;
    category?: string | string[];
    'content:encoded'?: string;
}

interface RssFeed {
    rss?: {
        channel?: {
            item?: RssItem | RssItem[];
        }
    }
}

interface AtomEntry {
    link?: { $?: { href?: string } } | Array<{ $?: { href?: string, rel?: string } }>;
    title?: string | { _?: string, $?: { type?: string } };
    summary?: string | { _?: string, $?: { type?: string } };
    content?: string | { _?: string, $?: { type?: string } };
    'media:content'?: { $?: { url?: string } };
    published?: string;
    updated?: string;
    category?: Array<{ $?: { term?: string } }> | { $?: { term?: string } };
}

interface AtomFeed {
    feed?: {
        entry?: AtomEntry | AtomEntry[];
    }
}

@Service()
export class ChannelsService {
    constructor(private readonly parserService: ParserService){}

    @Cron(CronExpression.EVERY_HOUR)
    async handleCronChannels() {
        return await this.processFeeds.call(this, false);
    }

    /**
     * Process the feed for a specific channel
     * @param channelId - The ID of the channel to process
     * @returns The result of the processing
     */
    async processFeed(channelId: string) {
        const FeedChannelsEntity = Repository.getEntity("FeedChannelsEntity");
        const FeedRawEntity = Repository.getEntity("FeedRawEntity");

        const channel = await Repository.findOne(FeedChannelsEntity, {
            id: channelId
        });

        if (!channel)
            throw new Error(`Channel not found: ${channelId}`);

        const feedData = await this.getFeed(channel.rss);
        await this.processFeedItem(feedData, channelId);

        return {
            success: true,
            message: `Feed processed successfully.`
        };
    }

    /**
     * Process the feeds
     * @param force - Force the processing of the feeds
     * @returns The result of the processing
     */
    async processFeeds(force: boolean = false) {
        const FeedChannelsEntity = Repository.getEntity("FeedChannelsEntity");

        try {
            const channels = await Repository.findAll(FeedChannelsEntity, {
                active: true,
                limit: 1000
            }, [], {
                select: ["id", "rss", "name", "intervalUpdate", "lastUpdate"]
            });

            if(!channels || !channels.data || channels.data.length === 0) {
                return {
                    success: true,
                    message: "No channels found to process."
                };
            }

            let itemsAdded = 0;

            const GLOBAL_TIMEOUT = 600000;
            const startTime = Date.now();
            const results = [];

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Global timeout reached for feed processing'));
                }, GLOBAL_TIMEOUT);
            });

            const processPromise = (async () => {
                for (const channel of channels.data) {
                    if (Date.now() - startTime > GLOBAL_TIMEOUT - 10000)
                        break;

                    if(channel.lastUpdate < new Date(Date.now() - channel.intervalUpdate) || force){
                        try {
                            const channelTimeout = 120000;

                            await Promise.race([
                                this.processSingleChannel(channel),
                                new Promise((_, reject) => {
                                    setTimeout(() => {
                                        reject(new Error(`Timeout processing channel ${channel.name}`));
                                    }, channelTimeout);
                                })
                            ]);

                            results.push({ channel: channel.name, success: true });
                        } catch (error) {
                            const errorMessage = error instanceof Error ? error.message : String(error);
                            results.push({ channel: channel.name, success: false, error: errorMessage });

                            try {
                                await Repository.update(FeedChannelsEntity, { id: channel.id }, {
                                    lastUpdate: new Date()
                                });
                            } catch (updateError) {}
                        }

                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                return results;
            })();

            const finalResults = await Promise.race([processPromise, timeoutPromise]) as Array<{ channel: string, success: boolean, error?: string }>;
            const successes = finalResults.filter(r => r.success).length;
            const failures = finalResults.filter(r => !r.success).length;

            return {
                success: true,
                message: `Processed ${finalResults.length} channels (${successes} successful, ${failures} failed)`,
                results: finalResults
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            return {
                success: false,
                message: `Feed processing failed: ${errorMessage}`
            };
        }
    }

    /**
     * Process a single channel safely
     * @param channel The channel to process
     */
    private async processSingleChannel(channel: any) {
        const FeedChannelsEntity = Repository.getEntity("FeedChannelsEntity");

        try {
            const feedData = await this.getFeed(channel.rss);
            await this.processFeedItem(feedData, channel.id);

            await Repository.update(FeedChannelsEntity, { id: channel.id }, {
                lastUpdate: new Date()
            });

            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error in processSingleChannel for ${channel.name}: ${errorMessage}`);

            try {
                await Repository.update(FeedChannelsEntity, { id: channel.id }, {
                    lastUpdate: new Date()
                });
            } catch (updateError) {
                console.error(`Failed to update lastUpdate for ${channel.name} after error`);
            }

            throw error;
        }
    }

    /**
     * Get the feed from the RSS URL
     * @param rss - The RSS URL
     * @returns The parsed feed JSON
     */
    async getFeed(rss: string): Promise<RssFeed> {
        try {
            const response = await fetch(rss);

            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);

            const xml = await response.text();

            const parser = new xml2js.Parser({
                explicitArray: false,
                normalize: true,
                normalizeTags: false,
                mergeAttrs: false,
                attrkey: '$'
            });

            return new Promise<RssFeed>((resolve, reject) => {
                parser.parseString(xml, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result as RssFeed);
                    }
                });
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error fetching or parsing feed from ${rss}: ${errorMessage}`);
            throw error;
        }
    }

    /**
     * Process the feed item
     * @param feedData - The feed data
     * @param channelId - The ID of the channel
     */
    async processFeedItem(feedData: any, channelId: string) {
        try {
            let items = [];
            let feedType = '';

            if (feedData.rss && feedData.rss.channel) {
                const feedItems = feedData.rss.channel.item;
                feedType = 'RSS';

                if (!feedItems)
                    return;

                items = Array.isArray(feedItems) ? feedItems : [feedItems];
            }
            else if (feedData.feed && feedData.feed.entry) {
                const feedEntries = feedData.feed.entry;
                feedType = 'Atom';

                if (!feedEntries)
                    return;

                items = Array.isArray(feedEntries) ? feedEntries : [feedEntries];
            } else {
                console.error(`Unsupported feed format for channel: ${channelId}`);
                return;
            }

            const MAX_ITEMS = 10;

            if (items.length > MAX_ITEMS) {
                items = items.slice(0, MAX_ITEMS);
            }

            let itemsAdded = 0;
            let processedCount = 0;

            for (const item of items) {
                processedCount++;

                try {
                    const itemPromise = this.processFeedItemSafely(item, feedType, channelId);

                    const result = await Promise.race([
                        itemPromise,
                        new Promise((_, reject) => {
                            setTimeout(() => {
                                reject(new Error(`Item processing timeout for item ${processedCount} in channel: ${channelId}`));
                            }, 15000);
                        })
                    ]) as { success: boolean, message?: string };

                    if (result && result.success)
                        itemsAdded++;
                } catch (itemError) {}

                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            return itemsAdded;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Process a single feed item safely with proper typing
     * @param item The feed item to process
     * @param feedType The type of feed (RSS or Atom)
     * @param channelId The channel ID
     * @returns Processing result
     */
    private async processFeedItemSafely(item: any, feedType: string, channelId: string): Promise<{ success: boolean, message?: string }> {
        const FeedRawEntity = Repository.getEntity("FeedRawEntity");
        const FeedChannelsEntity = Repository.getEntity("FeedChannelsEntity");

        try {
            const channel = await Repository.findOne(FeedChannelsEntity, {
                id: channelId
            });

            if (!channel)
                return { success: false, message: "Channel not found" };

            let link = '';
            let title = '';
            let content = '';
            let featureImage = '';
            let pubDate = new Date();
            let category = '';

            if (feedType === 'RSS') {
                link = item.link;
                title = item.title;

                if (item['content:encoded'])
                    content = item['content:encoded'];
                else if (item.content)
                    content = item.content;
                else if (item.description)
                    content = item.description;
                else
                    content = item.content || '';

                if (item['media:content'] && item['media:content'].$?.url)
                    featureImage = item['media:content'].$.url;
                else if (item['media:content'] && item['media:content'].url)
                    featureImage = item['media:content'].url;
                else if (item.enclosure && item.enclosure.$?.url)
                    featureImage = item.enclosure.$.url;
                else if (item.enclosure && item.enclosure.url)
                    featureImage = item.enclosure.url;
                // NOVO: tenta <media:thumbnail> ou primeira <img> do conteúdo
                else if (item['media:thumbnail'] && item['media:thumbnail'].$?.url)
                    featureImage = item['media:thumbnail'].$.url;
                else if (item['media:thumbnail'] && item['media:thumbnail'].url)
                    featureImage = item['media:thumbnail'].url;

                // Fallback: extrair primeira <img> do conteúdo HTML
                if (!featureImage && content) {
                    const imgMatch = content.match(/<img[^>]+src=[\"']([^\"']+)[\"']/i);
                    if (imgMatch) featureImage = imgMatch[1];
                }

                if (item.pubDate)
                    pubDate = new Date(item.pubDate);

                if (Array.isArray(item.category))
                    category = item.category[0];
                else if (item.category)
                    category = item.category;
            } else {
                if (Array.isArray(item.link)) {
                    const alternateLink = item.link.find((l: any) => l.$ && l.$.rel === 'alternate');
                    link = alternateLink ? alternateLink.$.href : (item.link[0].$ ? item.link[0].$.href : '');
                } else if (item.link && item.link.$) {
                    link = item.link.$.href;
                }

                if (typeof item.title === 'string')
                    title = item.title;
                else if (item.title) {
                    title = item.title._ || (item.title.$ && item.title.$._) || '';

                    if (title.startsWith('<![CDATA[') && title.endsWith(']]>'))
                        title = title.substring(9, title.length - 3).trim();
                }

                if (item.content)
                    content = typeof item.content === 'string' ? item.content : (item.content._ || '');
                else if (item.summary)
                    content = typeof item.summary === 'string' ? item.summary : (item.summary._ || '');

                if (content.startsWith('<![CDATA[') && content.endsWith(']]>'))
                    content = content.substring(9, content.length - 3).trim();

                if (item['media:content'] && item['media:content'].$?.url)
                    featureImage = item['media:content'].$.url;
                // NOVO: tenta <media:thumbnail>
                else if (item['media:thumbnail'] && item['media:thumbnail'].$?.url)
                    featureImage = item['media:thumbnail'].$.url;

                // Fallback: extrair primeira <img> do conteúdo para Atom
                if (!featureImage && content) {
                    const imgMatch = content.match(/<img[^>]+src=[\"']([^\"']+)[\"']/i);
                    if (imgMatch) featureImage = imgMatch[1];
                }

                if (item.published)
                    pubDate = new Date(item.published);
                else if (item.updated)
                    pubDate = new Date(item.updated);

                if (Array.isArray(item.category) && item.category.length > 0 && item.category[0].$)
                    category = item.category[0].$.term || '';
                else if (item.category && item.category.$)
                    category = item.category.$.term || '';
            }

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            if (pubDate < sevenDaysAgo)
                return { success: false, message: "Item is older than 7 days" };

            if (!link)
                return { success: false, message: "Empty link" };

            const existingItem = await Repository.findOne(FeedRawEntity, {
                link: link
            });

            if (existingItem)
                return { success: false, message: "Item already exists" };

            let parsingAttempted = false;
            let parsedResult: any = null;

            if (channel.requestLink === true) {
                try {
                    const parsePromise = this.parserService.parseContent(null, link);

                    parsedResult = await Promise.race([
                        parsePromise,
                        new Promise((_, reject) => {
                            setTimeout(() => {
                                reject(new Error('Parser timeout after 20 seconds'));
                            }, 20000);
                        })
                    ]);

                    parsingAttempted = true;

                    if (parsedResult &&
                        typeof parsedResult === 'object' &&
                        'success' in parsedResult &&
                        parsedResult.success === true &&
                        'data' in parsedResult &&
                        parsedResult.data) {

                        const data = parsedResult.data as any;

                        if (data && typeof data === 'object') {
                            if ('title' in data && data.title) title = data.title;
                            if ('content' in data && data.content) content = data.content;
                            if ('featureImage' in data && data.featureImage) featureImage = data.featureImage;
                        }
                    }
                } catch (parseError) {}
            }

            const newItem = {
                title,
                content: content,
                featureImage,
                link,
                pubDate,
                category,
                channel: channelId,
                feedType,
                hasParser: parsingAttempted && parsedResult && parsedResult.success ? true : false,
                parsedBy: parsingAttempted && parsedResult && parsedResult.success && parsedResult.data?.parserId ? parsedResult.data.parserId : null,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await Repository.insert(FeedRawEntity, newItem);
            return { success: true };
        } catch (error) {
            console.error(`Error processing feed item: ${error instanceof Error ? error.message : String(error)}`);
            return { success: false, message: error instanceof Error ? error.message : String(error) };
        }
    }
}
