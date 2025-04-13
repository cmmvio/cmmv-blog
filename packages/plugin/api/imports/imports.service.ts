import {
    Service,
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

import {
    PostsPublicService
} from "../posts/posts.service";

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import * as util from 'node:util';
import * as stream from 'node:stream';
import { Readable } from 'node:stream';
import { v4 as uuidv4 } from 'uuid';
import * as xml2js from 'xml2js';
import * as busboy from 'busboy';

type FileError = Error | null;
type StreamInfo = { filename: string; encoding: string; mimeType: string; };

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
    constructor(private readonly postsService: PostsPublicService) {}

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

                            this.processWordPressImport(wpData, importId).catch(error => {
                                console.error('Error during WordPress import processing:', error);
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

            this.processWordPressImport(wpData, importId).catch(error => {
                console.error('Error during WordPress import processing:', error);
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
            const items = Array.isArray(wpData.rss.channel.item)
                ? wpData.rss.channel.item
                : [wpData.rss.channel.item];

            let processed = 0;

            const ProfilesEntity = Repository.getEntity("ProfilesEntity");
            const TagsEntity = Repository.getEntity("TagsEntity");
            const CategoriesEntity = Repository.getEntity("CategoriesEntity");
            const PostsEntity = Repository.getEntity("PostsEntity");
            const RedirectsEntity = Repository.getEntity("RedirectsEntity");

            const rootAuthor = await Repository.findOne(ProfilesEntity, {}, {
                select: ["user"]
            });

            if(!rootAuthor)
                throw new Error("Root author not found");

            for (const item of items) {
                await new Promise(resolve => setTimeout(resolve, 100));
                let tags: string[] = [];
                let categories: string[] = [];

                console.log(`Processing post ${item["wp:post_name"]}`);

                if(item.category){
                    for(const category of item.category){
                        if(category["$"].domain === "post_tag"){
                            const tag = await Repository.findOne(TagsEntity, {
                                slug: category["$"].nicename
                            }, {
                                select: ["id", "name"]
                            });

                            if(!tag){
                                const tagData = await Repository.insert(TagsEntity, {
                                    slug: category["$"].nicename,
                                    name: category["_"]
                                });

                                tags.push(category["_"]);
                            } else {
                                tags.push(tag.name);
                            }
                        }
                        else if(category["$"].domain === "category"){
                            const categoryData = await Repository.findOne(CategoriesEntity, {
                                slug: category["$"].nicename
                            }, {
                                select: ["id"]
                            });

                            if(!categoryData){
                                const categoryData = await Repository.insert(CategoriesEntity, {
                                    slug: category["$"].nicename,
                                    name: category["_"],
                                    navigationLabel: category["_"],
                                    active: true
                                });

                                categories.push(categoryData.data.id);
                            } else {
                                categories.push(categoryData.id);
                            }
                        }
                    }
                }

                if(item["wp:post_type"] === "post" && item["wp:status"] === "publish"){
                    const post = await Repository.findOne(PostsEntity, {
                        slug: item["wp:post_name"]
                    });

                    if(post)
                        continue;

                    await Repository.insert(PostsEntity, {
                        slug: item["wp:post_name"],
                        title: item.title,
                        content: item["content:encoded"],
                        status: "published",
                        type: "post",
                        publishedAt: item["wp:post_date"] ? new Date(item["wp:post_date"]) : null,
                        updatedAt: item["wp:post_modified"] ? new Date(item["wp:post_modified"]) : null,
                        createdAt: item["wp:post_date"] ? new Date(item["wp:post_date"]) : null,
                        author: rootAuthor.user,
                        authors: [rootAuthor.user],
                        categories: categories,
                        tags: tags
                    });

                    await Repository.insert(RedirectsEntity, {
                        oldSlug: item["wp:post_name"],
                        redirectUrl: `/post/${item["wp:post_name"]}`,
                        codeStatus: 301,
                        refererId: item["wp:post_id"]
                    });

                    console.log(`Post ${item["wp:post_name"]} imported`);
                }
            }

            await this.postsService.recalculateTags();
            await this.postsService.recalculateCategories();

            console.log(`WordPress import completed: ${processed} items processed`);
        } catch (error: any) {
            console.error('Error processing WordPress import:', error);
        }
    }

    async importGhost(data: any) {
        console.log(data);
    }
}
