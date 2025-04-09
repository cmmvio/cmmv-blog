import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import { cwd } from "node:process";
import * as sharp from "sharp";

import {
    AbstractService,
    Config,
    Service
} from "@cmmv/core";

import {
    Repository
} from "@cmmv/repository";

@Service("blog_medias")
export class MediasService extends AbstractService {
    /**
     * Get image URL
     * @param image - Image
     * @param format - Format
     * @param maxWidth - Max width
     * @returns Image URL
     */
    async getImageUrl(
        image: string,
        format: string = "webp",
        maxWidth: number = 1024,
        alt: string = "",
        caption: string = ""
    ) {
        if(!image)
            return null;

        if(image.startsWith("http"))
            return image;

        const mediasPath = path.join(cwd(), "medias", "images");

        if(!fs.existsSync(mediasPath))
            await fs.mkdirSync(mediasPath, { recursive: true });

        const apiUrl = Config.get<string>("blog.url", process.env.API_URL);
        const paramString = `${image}_${format}_${maxWidth}`;
        const imageHash = await crypto.createHash('sha1').update(paramString).digest('hex');
        const imageFullpath = path.join(mediasPath, `${imageHash}.${format}`);
        const imageUrl = `${apiUrl}/images/${imageHash}.${format}`;

        if(!fs.existsSync(imageFullpath)) {
            const isValidImage = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/.test(image);

            if (!isValidImage) {
                console.error('Invalid image format provided');
                return null;
            }

            try {
                const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');

                //@ts-ignore
                let processor = sharp(buffer);
                const metadata = await processor.metadata();

                if (metadata.width && metadata.width > maxWidth) {
                    //@ts-ignore
                    const aspectRatio = metadata.width / metadata.height;
                    const newHeight = Math.round(maxWidth / aspectRatio);

                    processor = processor.resize(maxWidth, newHeight, {
                        fit: 'inside',
                        withoutEnlargement: true
                    });
                }

                switch (format.toLowerCase()) {
                    case 'webp':
                        processor = processor.webp({
                            quality: 70,
                            lossless: false,
                            //@ts-ignore
                            reductionEffort: 6
                        });
                        break;
                    case 'jpeg':
                    case 'jpg':
                        processor = processor.jpeg({
                            quality: 70,
                            progressive: true
                        });
                        break;
                    case 'png':
                        processor = processor.png({
                            compressionLevel: 9,
                            progressive: false,
                            adaptiveFiltering: true
                        });
                        break;
                    case 'avif':
                        processor = processor.avif({
                            quality: 70,
                            lossless: false,
                            effort: 7
                        });
                        break;
                    default:
                        processor = processor.webp({
                            quality: 70,
                            lossless: false,
                            //@ts-ignore
                            reductionEffort: 6
                        });
                        break;
                }

                const MediasEntity = Repository.getEntity("MediasEntity");
                const media = await Repository.findOne(MediasEntity, { sha1: imageHash });

                if(!media){
                    await Repository.insert(MediasEntity, {
                        sha1: imageHash,
                        filepath: imageFullpath,
                        name: image,
                        format: format,
                        width: metadata.width,
                        height: metadata.height,
                        alt: alt,
                        caption: caption,
                        size: metadata.size
                    });
                }

                await processor.toFile(imageFullpath);
                //await this.createThumbnail(image, format, imageHash);

                console.log(`Image saved as ${format}: ${imageFullpath} (${maxWidth}px max width)`);
            } catch (error) {
                console.error('Error processing image:', error);
                return null;
            }
        }

        return imageUrl;
    }

    /**
     * Creates a thumbnail with 3:2 aspect ratio and max height of 450px
     * @param image Base64 image string or URL
     * @param format Output format (webp, jpeg, png, avif)
     * @returns URL to the generated thumbnail or null if processing failed
     */
    /*async createThumbnail(image: string, format: string = "webp", hashOriginal: string): Promise<string | null> {
        if(!image) return null;
        if(image.startsWith("http")) return image;

        const maxHeight = 450;
        const aspectRatio = 3/2; // 3:2 ratio
        const targetWidth = Math.round(maxHeight * aspectRatio); // 675px
        const thumbnailsPath = path.join(cwd(), "medias", "thumbnails");

        if(!fs.existsSync(thumbnailsPath))
            await fs.mkdirSync(thumbnailsPath, { recursive: true });

        const imageFullpath = path.join(thumbnailsPath, `${hashOriginal}.${format}`);
        const imageUrl = `/api/images/thumbnails/${hashOriginal}.${format}`;

        if(!fs.existsSync(imageFullpath)) {
            const isValidImage = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/.test(image);

            if (!isValidImage) {
                console.error('Invalid image format provided for thumbnail');
                return null;
            }

            try {
                const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');

                //@ts-ignore
                let processor = sharp(buffer);

                processor = processor.resize({
                    width: targetWidth,
                    height: maxHeight,
                    fit: 'cover',
                    position: 'centre'
                });

                switch (format.toLowerCase()) {
                    case 'webp':
                        processor = processor.webp({
                            quality: 60,
                            lossless: false,
                            //@ts-ignore
                            reductionEffort: 6
                        });
                        break;
                    case 'jpeg':
                    case 'jpg':
                        processor = processor.jpeg({
                            quality: 60,  // Lower quality
                            progressive: true
                        });
                        break;
                    case 'png':
                        processor = processor.png({
                            compressionLevel: 9,
                            progressive: false,
                            adaptiveFiltering: true,
                            palette: true // Use palette for smaller thumbnails
                        });
                        break;
                    case 'avif':
                        processor = processor.avif({
                            quality: 50,  // Even lower for AVIF as it's more efficient
                            lossless: false,
                            effort: 7
                        });
                        break;
                    default:
                        processor = processor.webp({
                            quality: 60,
                            lossless: false,
                            //@ts-ignore
                            reductionEffort: 6
                        });
                        break;
                }

                await processor.toFile(imageFullpath);
                console.log(`Thumbnail saved as ${format}: ${imageFullpath} (${targetWidth}x${maxHeight})`);
            } catch (error) {
                console.error('Error processing thumbnail:', error);
                return null;
            }
        }

        return imageUrl;
    }*/

    /**
     * Get image
     * @param hash - Hash
     * @returns Image
     */
    async getImage(hash: string) {
        const mediasPath = path.join(cwd(), "medias", "images");
        const imageFullpath = path.join(mediasPath, hash);

        if(!fs.existsSync(imageFullpath))
            return null;

        return fs.readFileSync(imageFullpath);
    }

    /**
     * Get thumbnail
     * @param hash - Hash
     * @returns Thumbnail
     */
    async getThumbnail(hash: string) {
        const thumbnailsPath = path.join(cwd(), "medias", "thumbnails");
        const thumbnailFullpath = path.join(thumbnailsPath, hash);

        if(!fs.existsSync(thumbnailFullpath))
            return null;

        return fs.readFileSync(thumbnailFullpath);
    }

    /**
     * Get medias
     * @param queries - Queries
     * @returns Medias
     */
    async getMedias(queries: any){
        const MediasEntity = Repository.getEntity("MediasEntity");
        const medias = await Repository.findAll(MediasEntity, queries);
        const apiUrl = Config.get<string>("blog.url", process.env.API_URL);

        for(const media of medias?.data){
            media.url = `${apiUrl}/images/${media.sha1}.${media.format}`;;
        }

        return medias;
    }
}