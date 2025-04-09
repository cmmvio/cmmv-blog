"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediasService = void 0;
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const node_process_1 = require("node:process");
const sharp_1 = require("sharp");
const core_1 = require("@cmmv/core");
const repository_1 = require("@cmmv/repository");
let MediasService = class MediasService extends core_1.AbstractService {
    async getImageUrl(image, format = "webp", maxWidth = 1024, alt = "", caption = "") {
        if (!image)
            return null;
        if (image.startsWith("http"))
            return image;
        const mediasPath = path.join((0, node_process_1.cwd)(), "medias", "images");
        if (!fs.existsSync(mediasPath))
            await fs.mkdirSync(mediasPath, { recursive: true });
        const apiUrl = core_1.Config.get("blog.url", process.env.API_URL);
        const paramString = `${image}_${format}_${maxWidth}`;
        const imageHash = await crypto.createHash('sha1').update(paramString).digest('hex');
        const imageFullpath = path.join(mediasPath, `${imageHash}.${format}`);
        const imageUrl = `${apiUrl}/images/${imageHash}.${format}`;
        if (!fs.existsSync(imageFullpath)) {
            const isValidImage = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/.test(image);
            if (!isValidImage) {
                console.error('Invalid image format provided');
                return null;
            }
            try {
                const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                let processor = (0, sharp_1.default)(buffer);
                const metadata = await processor.metadata();
                if (metadata.width && metadata.width > maxWidth) {
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
                            reductionEffort: 6
                        });
                        break;
                }
                const MediasEntity = repository_1.Repository.getEntity("MediasEntity");
                const media = await repository_1.Repository.findOne(MediasEntity, { sha1: imageHash });
                if (!media) {
                    await repository_1.Repository.insert(MediasEntity, {
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
                console.log(`Image saved as ${format}: ${imageFullpath} (${maxWidth}px max width)`);
            }
            catch (error) {
                console.error('Error processing image:', error);
                return null;
            }
        }
        return imageUrl;
    }
    async getImage(hash) {
        const mediasPath = path.join((0, node_process_1.cwd)(), "medias", "images");
        const imageFullpath = path.join(mediasPath, hash);
        if (!fs.existsSync(imageFullpath))
            return null;
        return fs.readFileSync(imageFullpath);
    }
    async getThumbnail(hash) {
        const thumbnailsPath = path.join((0, node_process_1.cwd)(), "medias", "thumbnails");
        const thumbnailFullpath = path.join(thumbnailsPath, hash);
        if (!fs.existsSync(thumbnailFullpath))
            return null;
        return fs.readFileSync(thumbnailFullpath);
    }
    async getMedias(queries) {
        const MediasEntity = repository_1.Repository.getEntity("MediasEntity");
        const medias = await repository_1.Repository.findAll(MediasEntity, queries);
        const apiUrl = core_1.Config.get("blog.url", process.env.API_URL);
        for (const media of medias?.data) {
            media.url = `${apiUrl}/images/${media.sha1}.${media.format}`;
            ;
        }
        return medias;
    }
};
exports.MediasService = MediasService;
exports.MediasService = MediasService = __decorate([
    (0, core_1.Service)("blog_medias")
], MediasService);
//# sourceMappingURL=medias.service.js.map