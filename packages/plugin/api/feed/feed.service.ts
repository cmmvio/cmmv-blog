import {
    Service, Config
} from "@cmmv/core";

import {
    PostsPublicService
} from "../posts/posts.service";

@Service('blog_feed')
export class FeedService {
    constructor(
        private readonly postsService: PostsPublicService
    ){}

    async getFeed(queries: any, req: any) {
        const limit = Config.get<number>("blog.rssFeedItems", 10);
        const url = Config.get<string>("blog.url", process.env.API_URL);
        const title = Config.get<string>("blog.title", "CMMV Blog");
        const description = Config.get<string>("blog.description", "CMMV Blog");
        const language = Config.get<string>("blog.language", "en");
        const copyright = Config.get<string>("blog.copyright", "CMMV");

        const posts = await this.postsService.getAllPosts({
            limit: limit,
            sortBy: "publishedAt",
            sort: "desc",
            status: "published"
        }, req);

        let feed = [`<?xml version="1.0" encoding="UTF-8"?>`];
        feed.push(`<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" version="2.0">`);
        feed.push(`<channel>`);
        feed.push(`<title>${title}</title>`);
        feed.push(`<link>${url}</link>`);
        feed.push(`<description>${description}</description>`);
        feed.push(`<language>${language}</language>`);

        if(copyright)
            feed.push(`<copyright>© Copyright ${copyright}</copyright>`);

        feed.push(`<atom:link href="${url}/feed" rel="self" type="application/rss+xml"/>`)

        for (const post of posts.posts) {
            feed.push(`<item>`);
            feed.push(`<title>${post.title}</title>`);
            feed.push(`<link>${url}/${post.slug}</link>`);
            feed.push(`<pubDate>${post.publishedAt.toGMTString()}</pubDate>`);
            feed.push(`<guid isPermaLink="true">${url}/post/${post.slug}</guid>`);
            feed.push(`<description>
                <![CDATA[ <img src="${post.featureImage}" /><br /> ]]>
                ${this.stripHtml(post.content)}</description>`);
            feed.push(`<media:content url="${post.featureImage}" medium="image"/>`);

            for (const category of post.categories) {
                feed.push(`<category>${category.name}</category>`);
            }

            feed.push(`</item>`);
        }

        feed.push(`</channel>`);
        feed.push(`</rss>`);

        return feed.join("\n");
    }

    private stripHtml(html: string) {
        if (!html) return '';

        try {
            const textWithoutTags = html.replace(/<[^>]*>?/g, ' ');

            const decodedText = textWithoutTags
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&apos;/g, "'");

            const escapedText = decodedText
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');

            const normalizedText = escapedText
                .replace(/\s+/g, ' ')
                .trim();

            const maxLength = 500;
            if (normalizedText.length > maxLength) {
                return normalizedText.substring(0, maxLength) + '...';
            }

            return normalizedText;
        } catch (error) {
            console.error('Error stripping HTML:', error);
            return '';
        }
    }
}
