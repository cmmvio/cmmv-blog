import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import * as util from 'node:util';
import { Readable } from 'node:stream';
import * as crypto from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';
import * as xml2js from 'xml2js';
import * as busboy from 'busboy';
import { cwd } from "node:process";
import * as sharp from "sharp";

import {
    Config,
    Service,
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

import {
    PostsPublicService
} from "../posts/posts.service";

type FileError = Error | null;
type StreamInfo = { filename: string; encoding: string; mimeType: string; };

// Interface for tracking import progress
export interface ImportProgress {
    id: string;
    platform: 'wordpress' | 'ghost';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    totalItems: number;
    processedItems: number;
    startTime: Date;
    endTime?: Date;
    error?: string;
    logs: Array<{
        timestamp: Date;
        message: string;
        type: 'info' | 'warning' | 'error';
    }>;
}

interface WordPressXML {
    rss: {
        channel: {
            title?: string;
            link?: string;
            description?: string;
            pubdate?: string;
            item: WordPressItem[] | WordPressItem;
        }
    }
}

interface WordPressItem {
    title: string;
    link: string;
    pubdate?: string;
    "dc:creator"?: string;
    guid?: {
        "_": string;
    };
    description?: string;
    content?: string;
    "content:encoded"?: string;
    excerpt?: string;
    "excerpt:encoded"?: string;
    "wp:post_id"?: string;
    "wp:post_date"?: string;
    "wp:post_date_gmt"?: string;
    "wp:post_modified"?: string;
    "wp:post_modified_gmt"?: string;
    "wp:comment_status"?: string;
    "wp:ping_status"?: string;
    "wp:post_name"?: string;
    "wp:status"?: string;
    "wp:post_parent"?: string;
    "wp:menu_order"?: string;
    "wp:post_type"?: string;
    "wp:attachment_url"?: string;
    "category"?: Array<{
        "_": string,
        "$": {
            domain: string;
            nicename: string;
        }
    }>;
}

@Service('blog_imports')
export class ImportService {
    public imagesSizes: Record<string, { width: number, height: number }> = {};
    // Store import progress data
    private importProgress: Record<string, ImportProgress> = {};

    constructor(private readonly postsService: PostsPublicService) {}

    /**
     * Get import progress by ID
     * @param importId The import ID
     * @returns Import progress information or null if not found
     */
    getImportProgress(importId: string): ImportProgress | null {
        return this.importProgress[importId] || null;
    }

    /**
     * Get all active imports
     * @returns Array of active import progresses
     */
    getAllImportProgress(): ImportProgress[] {
        return Object.values(this.importProgress).filter(
            progress => progress.status === 'pending' || progress.status === 'processing'
        );
    }

    /**
     * Add a log entry to an import progress
     * @param importId The import ID
     * @param message Log message
     * @param type Log type (info, warning, error)
     */
    private addImportLog(importId: string, message: string, type: 'info' | 'warning' | 'error' = 'info'): void {
        if (!this.importProgress[importId]) return;

        this.importProgress[importId].logs.push({
            timestamp: new Date(),
            message,
            type
        });

        // If it's an error and the import is not failed yet, update the error message
        if (type === 'error' && this.importProgress[importId].status !== 'failed') {
            this.importProgress[importId].error = message;
        }
    }

    /**
     * Update import progress
     * @param importId The import ID
     * @param data Partial import progress data to update
     */
    private updateImportProgress(importId: string, data: Partial<ImportProgress>): void {
        if (!this.importProgress[importId]) return;

        this.importProgress[importId] = {
            ...this.importProgress[importId],
            ...data
        };
    }

    /**
     * Import WordPress posts from an XML file
     * @param req Request object
     * @returns Promise<any>
     */
    async importWordpress(req: any) {
        return new Promise<any>((resolve, reject) => {
            try {
                console.log("Processing WordPress import request");

                if (req.file || (req.files && req.files.file) || (req.body && req.body.file)) {
                    return this.processMiddlewareParsedFile(req)
                        .then(result => resolve(result))
                        .catch(error => reject(error));
                }

                console.log("Reading file from request stream");

                if (!req.headers || !req.headers['content-type']) {
                    return reject({
                        success: false,
                        message: 'Missing content-type header. Please ensure it is set to multipart/form-data'
                    });
                }

                const contentType = req.headers['content-type'];
                if (!contentType.includes('multipart/form-data')) {
                    return reject({
                        success: false,
                        message: `Invalid content-type: ${contentType}. Expected multipart/form-data`
                    });
                }

                if (!contentType.includes('boundary=')) {
                    return reject({
                        success: false,
                        message: 'Missing boundary in content-type header. Ensure the client sends a proper multipart/form-data request.'
                    });
                }

                const tmpDir = os.tmpdir();
                const tempFilePath = path.join(tmpDir, `wp-import-${uuidv4()}.xml`);

                let bbOptions;
                try {
                    bbOptions = { headers: req.headers };
                    //@ts-ignore
                    const bb = busboy(bbOptions);
                    let fileFound = false;
                    let fileError: FileError = null;

                    bb.on('file', (fieldname: string, fileStream: NodeJS.ReadableStream, info: StreamInfo) => {
                        console.log(`Processing file upload: ${fieldname}, filename: ${info.filename}`);

                        if (fieldname !== 'file') {
                            console.log(`Skipping non-'file' field: ${fieldname}`);
                            fileStream.resume(); // Skip this stream
                            return;
                        }

                        fileFound = true;
                        const writeStream = fs.createWriteStream(tempFilePath);

                        fileStream.pipe(writeStream);

                        fileStream.on('error', (error: Error) => {
                            console.error('Error reading file stream:', error);
                            fileError = error;
                            writeStream.end();
                        });

                        writeStream.on('error', (error: Error) => {
                            console.error('Error writing to temp file:', error);
                            fileError = error;
                            fileStream.resume(); // drain the stream
                        });
                    });

                    bb.on('field', (fieldname: string, value: string) => {
                        console.log(`Form field: ${fieldname}=${value}`);
                    });

                    bb.on('close', async () => {
                        try {
                            if (fileError) {
                                throw new Error(`File upload error: ${fileError.message}`);
                            }

                            if (!fileFound) {
                                throw new Error('No file uploaded. Make sure to send the file with field name "file"');
                            }

                            console.log(`File saved to ${tempFilePath}, now processing XML`);

                            const xmlContent = await fs.promises.readFile(tempFilePath, 'utf-8');

                            const parser = new xml2js.Parser({
                                explicitArray: false,
                                normalize: true,
                                normalizeTags: true
                            });

                            const parseXml: (xml: string) => Promise<WordPressXML> = util.promisify(parser.parseString.bind(parser));
                            const wpData = await parseXml(xmlContent);

                            fs.promises.unlink(tempFilePath).catch(err =>
                                console.warn('Failed to delete temp file:', err)
                            );

                            if (!wpData.rss || !wpData.rss.channel || !wpData.rss.channel.item)
                                throw new Error('Invalid WordPress export file format');

                            const items = Array.isArray(wpData.rss.channel.item)
                                ? wpData.rss.channel.item
                                : [wpData.rss.channel.item];

                            console.log(`WordPress import started: Found ${items.length} items`);

                            const importId = uuidv4();

                            // Initialize progress tracking
                            this.importProgress[importId] = {
                                id: importId,
                                platform: 'wordpress',
                                status: 'pending',
                                totalItems: items.length,
                                processedItems: 0,
                                startTime: new Date(),
                                logs: []
                            };

                            this.addImportLog(importId, `Import started with ${items.length} items`, 'info');

                            this.processWordPressImport(wpData, importId).catch(error => {
                                console.error('Error during WordPress import processing:', error);
                                this.updateImportProgress(importId, {
                                    status: 'failed',
                                    error: error.message || 'Unknown error during import',
                                    endTime: new Date()
                                });
                                this.addImportLog(importId, `Import failed: ${error.message}`, 'error');
                            });

                            resolve({
                                success: true,
                                message: 'WordPress import started successfully',
                                importId
                            });
                        } catch (error: any) {
                            console.error('Error processing WordPress import:', error);

                            fs.promises.unlink(tempFilePath).catch(() => {});
                            reject({
                                success: false,
                                message: error.message || 'Failed to import WordPress content'
                            });
                        }
                    });

                    bb.on('error', (error: Error) => {
                        console.error('Error parsing form data:', error);
                        reject({
                            success: false,
                            message: `Error parsing form data: ${error.message}`
                        });
                    });

                    if (req.readable) {
                        req.pipe(bb);
                    } else if (req.body && Buffer.isBuffer(req.body)) {
                        const readable = new Readable();
                        readable.push(req.body);
                        readable.push(null);
                        readable.pipe(bb);
                    } else {
                        reject({
                            success: false,
                            message: 'Request is not readable stream and no file content was found'
                        });
                    }
                } catch (error: any) {
                    console.error('Busboy initialization error:', error);
                    reject({
                        success: false,
                        message: `Failed to parse multipart form: ${error.message}`
                    });
                }
            } catch (error: any) {
                console.error('WordPress import error:', error);
                reject({
                    success: false,
                    message: error.message || 'Failed to import WordPress content'
                });
            }
        });
    }

    /**
     * Process the file when already parsed by middleware
     * @param req Request object
     * @returns Promise<any>
     */
    private async processMiddlewareParsedFile(req: any) {
        try {
            let uploadedFile: any = null;

            if (req.file) {
                uploadedFile = req.file;
            }
            else if (req.files && req.files.file) {
                uploadedFile = req.files.file;
            }
            else if (req.body && req.body.file) {
                uploadedFile = req.body.file;
            }

            if (!uploadedFile)
                throw new Error('No file uploaded. Make sure to send the file with field name "file" in multipart/form-data.');

            let xmlContent: string;

            if (Buffer.isBuffer(uploadedFile)) {
                xmlContent = uploadedFile.toString('utf-8');
            } else if (typeof uploadedFile.buffer !== 'undefined') {
                xmlContent = uploadedFile.buffer.toString('utf-8');
            } else if (typeof uploadedFile.path !== 'undefined') {
                const readFile = util.promisify(fs.readFile);
                xmlContent = await readFile(uploadedFile.path, 'utf-8');
            } else if (typeof uploadedFile.data !== 'undefined') {
                xmlContent = uploadedFile.data.toString('utf-8');
            } else {
                throw new Error('Unsupported file upload format');
            }

            const parser = new xml2js.Parser({
                explicitArray: false,
                normalize: true,
                normalizeTags: true
            });

            const parseXml: (xml: string) => Promise<WordPressXML> = util.promisify(parser.parseString.bind(parser));
            const wpData = await parseXml(xmlContent);

            if (!wpData.rss || !wpData.rss.channel || !wpData.rss.channel.item) {
                throw new Error('Invalid WordPress export file format');
            }

            const items = Array.isArray(wpData.rss.channel.item)
                ? wpData.rss.channel.item
                : [wpData.rss.channel.item];

            console.log(`WordPress import started: Found ${items.length} items`);

            const importId = uuidv4();

            // Initialize progress tracking
            this.importProgress[importId] = {
                id: importId,
                platform: 'wordpress',
                status: 'pending',
                totalItems: items.length,
                processedItems: 0,
                startTime: new Date(),
                logs: []
            };

            this.addImportLog(importId, `Import started with ${items.length} items`, 'info');

            this.processWordPressImport(wpData, importId).catch(error => {
                console.error('Error during WordPress import processing:', error);
                this.updateImportProgress(importId, {
                    status: 'failed',
                    error: error.message || 'Unknown error during import',
                    endTime: new Date()
                });
                this.addImportLog(importId, `Import failed: ${error.message}`, 'error');
            });

            return {
                success: true,
                message: 'WordPress import started successfully',
                importId
            };
        } catch (error: any) {
            console.error('WordPress import error:', error);
            return {
                success: false,
                message: error.message || 'Failed to import WordPress content'
            };
        }
    }

    /**
     * Process WordPress import data asynchronously
     * This runs in the background after the HTTP response is sent
     * @param wpData WordPress XML data
     * @param importId Import ID
     */
    private async processWordPressImport(wpData: WordPressXML, importId: string) {
        try {
            this.updateImportProgress(importId, { status: 'processing' });

            const items = Array.isArray(wpData.rss.channel.item)
                ? wpData.rss.channel.item
                : [wpData.rss.channel.item];

            let processed = 0;
            let attachmentsTotal = 0;
            let attachmentsProcessed = 0;
            let postsTotal = 0;
            let postsProcessed = 0;

            // Count different types of items
            items.forEach(item => {
                if (item["wp:post_type"] === "attachment") {
                    attachmentsTotal++;
                } else if (item["wp:post_type"] === "post" && item["wp:status"] === "publish") {
                    postsTotal++;
                }
            });

            this.addImportLog(importId, `Found ${attachmentsTotal} attachments and ${postsTotal} posts to import`, 'info');

            const ProfilesEntity = Repository.getEntity("ProfilesEntity");
            const TagsEntity = Repository.getEntity("TagsEntity");
            const CategoriesEntity = Repository.getEntity("CategoriesEntity");
            const PostsEntity = Repository.getEntity("PostsEntity");
            const RedirectsEntity = Repository.getEntity("RedirectsEntity");
            const MediasEntity = Repository.getEntity("MediasEntity");

            const rootAuthor = await Repository.findOne(ProfilesEntity, {}, {
                select: ["user"]
            });

            if(!rootAuthor) {
                const error = new Error("Root author not found");
                this.updateImportProgress(importId, {
                    status: 'failed',
                    error: error.message,
                    endTime: new Date()
                });
                this.addImportLog(importId, error.message, 'error');
                throw error;
            }

            const mediasPath = path.join(cwd(), "medias", "images");

            if(!fs.existsSync(mediasPath)) {
                await fs.mkdirSync(mediasPath, { recursive: true });
                this.addImportLog(importId, `Created medias directory at ${mediasPath}`, 'info');
            }

            let attachments: Record<string, string> = {};
            let imagesFormat = ["jpg", "jpeg", "png", "gif", "webp"];
            const apiUrl = Config.get<string>("blog.url", process.env.API_URL);

            // First process attachments
            this.addImportLog(importId, "Processing attachments...", 'info');
            for (const item of items) {
                if(item["wp:post_type"] === "attachment" && item["wp:attachment_url"]) {
                    try {
                        const url = item["wp:attachment_url"];
                        const filename = path.basename(url);
                        const imageUrl = `${apiUrl}/images/${filename}`;
                        //@ts-ignore
                        attachments[item["wp:post_parent"]] = imageUrl;

                        this.addImportLog(importId, `Processing attachment: ${filename}`, 'info');
                        const media = await Repository.findOne(MediasEntity, { filepath: filename });

                        if(media) {
                            this.addImportLog(importId, `Attachment ${filename} already exists, skipping`, 'info');
                            attachmentsProcessed++;
                            continue;
                        }

                        this.addImportLog(importId, `Downloading attachment: ${url}`, 'info');

                        const destPath = path.join(mediasPath, filename);
                        const res = await fetch(item["wp:attachment_url"]);

                        if (!res.ok) {
                            const errorMsg = `Failed to download attachment ${item["wp:attachment_url"]} - Status: ${res.status}`;
                            this.addImportLog(importId, errorMsg, 'error');
                            continue;
                        }

                        const buffer = await res.arrayBuffer();
                        await fs.writeFileSync(destPath, Buffer.from(buffer));
                        let metadata: any = null;

                        if(imagesFormat.includes(filename.split(".").pop() || "")) {
                            //@ts-ignore
                            let processor = sharp(buffer);
                            metadata = await processor.metadata();
                        }

                        if(!metadata) {
                            metadata = {
                                width: 0,
                                height: 0,
                                size: 0
                            };
                        }

                        const imageHash = await crypto.createHash('sha1').update(url).digest('hex');

                        await Repository.insert(MediasEntity, {
                            filepath: filename,
                            sha1: imageHash,
                            name: filename,
                            width: metadata.width,
                            height: metadata.height,
                            size: metadata.size
                        });

                        this.addImportLog(importId, `Attachment ${filename} processed successfully`, 'info');
                        attachmentsProcessed++;
                    } catch (error: any) {
                        this.addImportLog(importId, `Error processing attachment: ${error.message}`, 'error');
                    } finally {
                        this.updateImportProgress(importId, {
                            processedItems: processed + attachmentsProcessed
                        });
                    }
                }
            }

            this.addImportLog(importId, `Processed ${attachmentsProcessed}/${attachmentsTotal} attachments`, 'info');
            this.addImportLog(importId, "Processing posts...", 'info');

            // Then process posts
            for (const item of items) {
                await new Promise(resolve => setTimeout(resolve, 100));
                let tags: string[] = [];
                let categories: string[] = [];

                if(item["wp:post_type"] === "post" && item["wp:status"] === "publish") {
                    try {
                        this.addImportLog(importId, `Processing post: ${item["wp:post_name"]}`, 'info');

                        if(item.category) {
                            for(const category of item.category) {
                                if(category["$"].domain === "post_tag") {
                                    const tag = await Repository.findOne(TagsEntity, {
                                        slug: category["$"].nicename
                                    }, {
                                        select: ["id", "name"]
                                    });

                                    if(!tag) {
                                        await Repository.insert(TagsEntity, {
                                            slug: category["$"].nicename,
                                            name: category["_"]
                                        });

                                        tags.push(category["_"]);
                                        this.addImportLog(importId, `Created tag: ${category["_"]}`, 'info');
                                    } else {
                                        tags.push(tag.name);
                                    }
                                }
                                else if(category["$"].domain === "category") {
                                    const categoryData = await Repository.findOne(CategoriesEntity, {
                                        slug: category["$"].nicename
                                    }, {
                                        select: ["id"]
                                    });

                                    if(!categoryData) {
                                        const categoryData = await Repository.insert(CategoriesEntity, {
                                            slug: category["$"].nicename,
                                            name: category["_"],
                                            navigationLabel: category["_"],
                                            active: true
                                        });

                                        categories.push(categoryData.data.id);
                                        this.addImportLog(importId, `Created category: ${category["_"]}`, 'info');
                                    } else {
                                        categories.push(categoryData.id);
                                    }
                                }
                            }
                        }

                        const post = await Repository.findOne(PostsEntity, {
                            slug: item["wp:post_name"]
                        });

                        if(post) {
                            this.addImportLog(importId, `Post ${item["wp:post_name"]} already exists, skipping`, 'info');
                            postsProcessed++;
                            continue;
                        }

                        await Repository.insert(PostsEntity, {
                            slug: item["wp:post_name"],
                            title: item.title,
                            content: this.processWordpressContent(item["content:encoded"]),
                            status: "published",
                            type: "post",
                            publishedAt: item["wp:post_date"] ? new Date(item["wp:post_date"]) : null,
                            updatedAt: item["wp:post_modified"] ? new Date(item["wp:post_modified"]) : null,
                            createdAt: item["wp:post_date"] ? new Date(item["wp:post_date"]) : null,
                            author: rootAuthor.user,
                            authors: [rootAuthor.user],
                            categories: categories,
                            tags: tags,
                            //@ts-ignore
                            featureImage: attachments[item["wp:post_id"]]
                        });

                        await Repository.insert(RedirectsEntity, {
                            oldSlug: item["wp:post_name"],
                            redirectUrl: `/post/${item["wp:post_name"]}`,
                            codeStatus: 301,
                            refererId: item["wp:post_id"]
                        });

                        this.addImportLog(importId, `Post ${item["wp:post_name"]} imported successfully`, 'info');
                        postsProcessed++;
                    } catch (error: any) {
                        this.addImportLog(importId, `Error processing post ${item["wp:post_name"]}: ${error.message}`, 'error');
                    } finally {
                        processed++;
                        this.updateImportProgress(importId, {
                            processedItems: attachmentsProcessed + postsProcessed
                        });
                    }
                }
            }

            this.addImportLog(importId, `Processed ${postsProcessed}/${postsTotal} posts`, 'info');
            this.addImportLog(importId, "Recalculating tags and categories...", 'info');

            await this.postsService.recalculateTags();
            await this.postsService.recalculateCategories();

            this.addImportLog(importId, "Finalizing import...", 'info');
            this.updateImportProgress(importId, {
                status: 'completed',
                endTime: new Date()
            });

            this.addImportLog(importId, `WordPress import completed successfully: ${processed} items processed`, 'info');

            // After some time, remove the progress data to prevent memory leaks
            setTimeout(() => {
                delete this.importProgress[importId];
            }, 1000 * 60 * 60 * 24); // Remove after 24 hours

        } catch (error: any) {
            console.error('Error processing WordPress import:', error);
            this.updateImportProgress(importId, {
                status: 'failed',
                error: error.message || 'Unknown error during import',
                endTime: new Date()
            });
            this.addImportLog(importId, `Import failed: ${error.message}`, 'error');
        }
    }

    /**
     * Process WordPress content to handle YouTube embeds
     * @param content WordPress content
     * @returns Processed content with YouTube embeds replaced by proper iframe
     */
    private processWordpressContent(content: string | undefined): string {
        if (!content) return '';

        let processedContent = content;

        // First process YouTube embeds to ensure they're handled before we remove WordPress comments
        const youtubeBlockPattern = /<!-- wp:embed[\s\S]*?youtube.com\/watch\?v=([a-zA-Z0-9_-]+)[\s\S]*?<!-- \/wp:embed -->/g;

        processedContent = processedContent.replace(youtubeBlockPattern, (match, videoId) => {
            console.log(`Found YouTube embed, video ID: ${videoId}`);

            return `<iframe title="YouTube Video" width="720" height="405" data-lazy="true" src="https://www.youtube.com/embed/${videoId}?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        });

        // Process plain YouTube URLs
        const plainYoutubeUrlPattern = /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g;

        processedContent = processedContent.replace(plainYoutubeUrlPattern, (match, videoId) => {
            const isInIframe = new RegExp(`<iframe[^>]*${videoId}[^>]*>`, 'i').test(processedContent);

            if (isInIframe)
                return match;

            return `<iframe title="YouTube Video" width="720" height="405" data-lazy="true" src="https://www.youtube.com/embed/${videoId}?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        });

        // Process WordPress image blocks
        const imageBlockPattern = /<!-- wp:image[\s\S]*?<figure[^>]*><img[^>]*src="([^"]+)[^>]*\/>(?:<figcaption>([^<]*)<\/figcaption>)?<\/figure>\s*<!-- \/wp:image -->/g;

        processedContent = processedContent.replace(imageBlockPattern, (match, imageUrl, caption) => {
            try {
                const filename = imageUrl.split('/').pop();
                if (!filename) return match;

                // Extract dimensions before removing the suffix
                const dimensionsMatch = filename.match(/-(\d+)x(\d+)(\.[^.]+)$/);
                let width = 0;
                let height = 0;

                if (dimensionsMatch) {
                    width = parseInt(dimensionsMatch[1], 10);
                    height = parseInt(dimensionsMatch[2], 10);

                    // Store dimensions for future reference
                    this.imagesSizes[filename] = { width, height };
                }

                const cleanFilename = filename.replace(/-\d+x\d+(\.[^.]+)$/, '$1');
                console.log(`Processing image: ${filename} -> ${cleanFilename} (${width}x${height})`);

                const newImagePath = `/images/${cleanFilename}`;

                const widthAttr = width ? ` width="${width}"` : '';
                const heightAttr = height ? ` height="${height}"` : '';

                if (caption) {
                    return `<figure><img src="${newImagePath}" alt="${caption}"${widthAttr}${heightAttr} /><figcaption>${caption}</figcaption></figure>`;
                } else {
                    return `<img src="${newImagePath}" alt=""${widthAttr}${heightAttr} />`;
                }
            } catch (error) {
                console.error('Error processing image block:', error);
                return match;
            }
        });

        // Also process regular img tags not in blocks
        const imgTagPattern = /<img[^>]*src="([^"]+)\/([^\/]+\.(jpg|jpeg|png|gif|webp))"[^>]*>/g;

        processedContent = processedContent.replace(imgTagPattern, (match, urlPath, filename) => {
            try {
                if (urlPath.includes('/images/')) return match;

                // Extract dimensions before removing the suffix
                const dimensionsMatch = filename.match(/-(\d+)x(\d+)(\.[^.]+)$/);
                let width = 0;
                let height = 0;

                if (dimensionsMatch) {
                    width = parseInt(dimensionsMatch[1], 10);
                    height = parseInt(dimensionsMatch[2], 10);

                    // Store dimensions for future reference
                    this.imagesSizes[filename] = { width, height };
                }

                const cleanFilename = filename.replace(/-\d+x\d+(\.[^.]+)$/, '$1');

                const altMatch = match.match(/alt="([^"]*)"/);
                const alt = altMatch ? altMatch[1] : '';

                console.log(`Processing img tag: ${filename} -> ${cleanFilename} (${width}x${height})`);

                const widthAttr = width ? ` width="${width}"` : '';
                const heightAttr = height ? ` height="${height}"` : '';

                return `<img src="/images/${cleanFilename}" alt="${alt}"${widthAttr}${heightAttr} />`;
            } catch (error) {
                console.error('Error processing img tag:', error);
                return match;
            }
        });

        const processedBlockTypes = ['image', 'embed'];
        for (const blockType of processedBlockTypes) {
            const blockStartPattern = new RegExp(`<!-- wp:${blockType}[\\s\\S]*?-->`, 'g');
            const blockEndPattern = new RegExp(`<!-- /wp:${blockType} -->`, 'g');

            processedContent = processedContent.replace(blockStartPattern, '');
            processedContent = processedContent.replace(blockEndPattern, '');
        }

        processedContent = processedContent.replace(/<!-- wp:[a-z-]+(?: \{[^}]*\})? -->/g, '');
        processedContent = processedContent.replace(/<!-- \/wp:[a-z-]+ -->/g, '');
        processedContent = processedContent.replace(/<p>\s*<\/p>/g, '');
        processedContent = processedContent.replace(/<div>\s*<\/div>/g, '');
        processedContent = processedContent.replace(/\n{3,}/g, '\n\n');

        return processedContent;
    }

    /**
     * Import Ghost posts from an XML file
     * @param data Import data
     * @returns Promise<any>
     */
    async importGhost(data: any) {
        throw new Error("Not implemented");
    }
}
