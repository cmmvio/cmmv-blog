import {
    Service, Logger, Config
} from "@cmmv/core";

import {
    Repository, IsNull,
    MoreThanOrEqual
} from "@cmmv/repository";

//@ts-ignore
import { AIContentService } from "@cmmv/ai-content";

@Service("yt-videos")
export class YTVideosServiceAdmin {
    private readonly logger = new Logger("YTVideosService");

    constructor(
        private readonly aiContentService: AIContentService
    ) {}

    /**
     * Get videos with optional filters
     * @param queries Query parameters for filtering videos
     * @returns List of videos matching the filters
     */
    async getVideos(queries: any) {
        const YTVideosEntity = Repository.getEntity("YTVideosEntity");

        const videos = await Repository.findAll(YTVideosEntity, {
            limit: queries.limit || 10,
            offset: queries.offset || 0,
            sortBy: queries.sortBy || "publishedAt",
            sort: queries.sort|| "DESC",
            rejected: false,
            blogPostId: IsNull(),
            publishedAt: MoreThanOrEqual(new Date(Date.now() - 1000 * 60 * 60 * 24 * 2))
        });

        return videos;
    }

    /**
     * Get AI processed content for a YouTube video
     * @param id The ID of the video
     * @param customData Optional custom data to override video data
     * @returns AI generated content for the video
     */
    async getAIVideo(id: string, customData?: any) {
        try {
            const language = Config.get("blog.language");
            const YTVideosEntity = Repository.getEntity("YTVideosEntity");
            const video = await Repository.findOne(YTVideosEntity, {
                id: id
            });

            if (!video)
                throw new Error(`Video with ID ${id} not found`);

            const YTChannelsEntity = Repository.getEntity("YTChannelsEntity");
            const channel = await Repository.findOne(YTChannelsEntity, {
                id: video.channelId
            });

            const channelName = channel ? channel.name : "Unknown Channel";

            const contentToProcess = {
                title: customData?.title || video.title,
                description: customData?.description || video.description,
                videoId: customData?.videoId || video.videoId,
                url: customData?.url || video.url,
                channelName: channelName,
                publishedAt: video.publishedAt
            };

            const prompt = `
            You are a content creator who specializes in creating high-quality blog posts about YouTube videos.

            I will provide details about a YouTube video, and your task is to create an engaging blog post about it.

            Please transform the following YouTube video information into a well-structured blog post by:

            - ONLY use images that exist in the original post - DO NOT create or generate new images that don't exist

            1. Translating it to ${language}
            2. Creating an engaging title that captures the essence of the content (keep it under 80 characters)
            3. Writing a comprehensive article that summarizes the key points and insights from the video
            4. Adding context, background information, and your own analysis to enhance the content
            5. Preserving important links to sources and reference pages, but adding rel="noindex nofollow" attributes to all links
            6. Creating a well-structured HTML article using proper formatting:
               - Use <h2> tags for main sections (2-4 sections recommended)
               - Use <p> tags for paragraphs
               - Use <ul> and <li> tags for lists where appropriate
               - Include a concluding paragraph
               - For links, use: <a href="https://example.com" rel="noindex nofollow" target="_blank">text</a>
            7. Start with a strong introductory paragraph before any video embed (the video will be automatically inserted after the first paragraph)
            8. Suggesting 3-8 relevant tags for categorizing this content

            IMPORTANT:
            - For titles, DO NOT default to number-based formats (like "5 Ways to..." or "10 Tips for...")
            - Only use numbered titles when the content specifically warrants it (such as step-by-step guides or ranked lists)
            - Prefer descriptive, narrative or question-based titles that engage readers without relying on numbers
            - Avoid sensationalist or clickbait headlines

            For titles, use these headline formulas (preferring the non-numbered options):

            1. The "How-To Formula":
            How to [Achieve Desired Outcome] without [Common Pain Point]

            Examples:
            - "How to Master Advanced Photo Editing Without Expensive Software"
            - "How to Build a Gaming PC Without Breaking Your Budget"
            - "How to Start Streaming on YouTube Without Technical Headaches"

            2. The "Question Formula":
            [Intriguing Question That Promises an Answer]?

            Examples:
            - "Is This the Gaming Setup You've Been Waiting For?"
            - "What Makes This New GPU a Game-Changer for Creators?"
            - "Why Are Professional Streamers Switching to This Platform?"

            3. The "Secret Formula":
            The Secret to [Achieving Desired Outcome] That [Target Audience] Don't Know About

            Examples:
            - "The Secret to Viral YouTube Content That New Creators Miss"
            - "The Hidden Settings in Minecraft That Pro Players Use"
            - "The Audio Trick That Makes Your Videos Sound Professional"

            4. The "Why Formula":
            Why [Common Belief/Practice] Is [Wrong/Ineffective] and What to Do Instead

            Examples:
            - "Why Traditional Gaming Setups Are Holding You Back"
            - "Why Your YouTube Algorithm Recommendations Are Stuck"
            - "Why Most PC Builds Fail and How to Succeed"

            5. The "Comparison Formula":
            [Product/Method A] vs [Product/Method B]: Which Is Better for [Desired Outcome]

            Examples:
            - "Console vs PC Gaming: Which Is Better for Competitive Play"
            - "OBS vs Streamlabs: Which Recording Software Delivers Better Quality"
            - "AMD vs NVIDIA: Which GPU Line Offers More Value in 2023"

            6. The "Ultimate Guide":
            The Ultimate Guide to [Topic] for [Target Audience]

            Examples:
            - "The Ultimate Guide to YouTube Growth for New Creators"
            - "The Complete Guide to Building Your First Gaming PC"
            - "The Definitive Guide to Optimizing Your Streaming Setup"

            7. The "Warning Formula":
            [Warning Sign] - [Problem] You Need to Address Now

            Examples:
            - "Warning - Your Gaming Hardware Might Be Silently Failing"
            - "Alert - The YouTube Change That Affects All Content Creators"
            - "Caution - This Common Streaming Mistake Is Costing You Viewers"

            The title MUST be 100 characters or less, clear, factual, and non-sensationalist, accurately representing the content.

            DO NOT include instructions to watch the video or subscribe to the channel. The post should stand alone as valuable content.

            Here is the YouTube video information:

            Title: ${contentToProcess.title}

            Video ID: ${contentToProcess.videoId}

            Channel: ${contentToProcess.channelName}

            Description: ${contentToProcess.description}

            Video URL: ${contentToProcess.url}

            Published Date: ${new Date(contentToProcess.publishedAt).toDateString()}

            Return the blog post in JSON format with the following fields:
            {
              "title": "your engaging blog post title",
              "content": "HTML-formatted blog post content with proper tags",
              "excerpt": "a brief 1-2 sentence summary of the video for meta description (max 160 characters)",
              "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
            }
            `;

            const generatedText = await this.aiContentService.generateContent(prompt);

            if (!generatedText)
                throw new Error('No content generated by AI');

            try {
                const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
                const jsonContent = jsonMatch ? jsonMatch[0] : null;

                if (!jsonContent)
                    throw new Error('No JSON content found in AI response');

                const parsedContent = JSON.parse(jsonContent);

                if (parsedContent.title && parsedContent.title.length > 100) {
                    parsedContent.title = parsedContent.title.substring(0, 97) + '...';
                    this.logger.log(`Title was truncated to 100 characters for video ${id}`);
                }

                const videoEmbed = `
<div class="video-embed aspect-video mb-6">
  <iframe
    width="100%"
    height="100%"
    src="https://www.youtube.com/embed/${video.videoId}"
    loading="lazy"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>`;

                const videoAttribution = `
<p class="text-sm text-gray-500 mt-4">
  <em>Originally published on <a href="${video.url}" target="_blank" rel="noindex nofollow noopener">YouTube</a>
  by ${channelName} on ${new Date(video.publishedAt).toDateString()}</em>
</p>`;

                let contentWithVideo = parsedContent.content;
                const firstParagraphEnd = contentWithVideo.indexOf('</p>') + 4;
                if (firstParagraphEnd > 4) {
                    contentWithVideo =
                        contentWithVideo.substring(0, firstParagraphEnd) +
                        '\n\n' + videoEmbed + '\n\n' +
                        contentWithVideo.substring(firstParagraphEnd);
                } else {
                    // Fallback if no paragraph tag found
                    contentWithVideo = videoEmbed + '\n\n' + contentWithVideo;
                }

                parsedContent.content = contentWithVideo + '\n\n' + videoAttribution;

                if (parsedContent.excerpt && parsedContent.excerpt.length > 160)
                    parsedContent.excerpt = parsedContent.excerpt.substring(0, 157) + '...';

                return {
                    ...video,
                    originalTitle: video.title,
                    originalDescription: video.description,
                    title: parsedContent.title,
                    content: parsedContent.content,
                    excerpt: parsedContent.excerpt || '',
                    suggestedTags: parsedContent.suggestedTags || [],
                    aiProcessed: true,
                    processedAt: new Date()
                };
            } catch (parseError) {
                this.logger.error(`Failed to parse AI generated content: ${parseError}`);
                throw new Error('Failed to parse AI generated content');
            }

        } catch (error: unknown) {
            this.logger.error(`Error in getAIVideo: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    /**
     * Update a video
     * @param id Video ID
     * @param data Update data
     * @returns Update result
     */
    async updateVideo(id: string, data: any) {
        try {
            const YTVideosEntity = Repository.getEntity("YTVideosEntity");

            const video = await Repository.findOne(YTVideosEntity, { id });

            if (!video)
                throw new Error(`Video with ID ${id} not found`);

            await Repository.update(YTVideosEntity, { id }, data);

            return {
                success: true,
                message: "Video updated successfully"
            };
        } catch (error) {
            this.logger.error(`Error updating video: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    /**
     * Reject a video
     * @param id Video ID
     * @param reason Rejection reason
     * @returns Rejection result
     */
    async rejectVideo(id: string, reason: string) {
        try {
            const YTVideosEntity = Repository.getEntity("YTVideosEntity");
            const video = await Repository.findOne(YTVideosEntity, { id });

            if (!video)
                throw new Error(`Video with ID ${id} not found`);

            await Repository.update(YTVideosEntity, { id }, { rejected: true });

            return {
                success: true,
                message: "Video rejected successfully"
            };
        } catch (error) {
            this.logger.error(`Error rejecting video: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
}
