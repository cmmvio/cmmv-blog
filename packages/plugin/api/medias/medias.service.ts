import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import { cwd } from "node:process";
import * as sharp from "sharp";

import {
    AbstractService,
    Config, Service
} from "@cmmv/core";

import {
    Repository, In
} from "@cmmv/repository";

@Service("blog_medias")
export class MediasService extends AbstractService {
    /**
     * Track progress for reprocessing images
     */
    private static reprocessProgress = {
        total: 0,
        processed: 0,
        status: 'idle',
        message: '',
        details: {
            scanned: 0,
            added: 0,
            removed: 0,
            optimized: 0,
            failed: 0,
            bytes_saved: 0
        }
    };

    /**
     * Get the current progress of reprocessing
     * @returns Progress information
     */
    async getReprocessProgress() {
        const progress = MediasService.reprocessProgress;
        const percentage = progress.total > 0
            ? Math.round((progress.processed / progress.total) * 100)
            : 0;

        const result = {
            ...progress,
            percentage
        };

        return result;
    }

    /**
     * Initialize progress tracker with a specific operation
     * @param operation The name of the operation (e.g., "cleaning", "reprocessing")
     * @param totalItems The expected total number of items to process (can be updated later)
     */
    async initializeProgress(operation: string, totalItems: number = 0) {
        this.resetProgress();
        MediasService.reprocessProgress.status = 'processing';
        MediasService.reprocessProgress.message = `Starting ${operation} operation...`;
        MediasService.reprocessProgress.total = totalItems;

        return {
            success: true,
            message: `Progress tracker initialized for ${operation}`
        };
    }

    /**
     * Reset progress tracker
     */
    private resetProgress() {
        MediasService.reprocessProgress = {
            total: 0,
            processed: 0,
            status: 'idle',
            message: '',
            details: {
                scanned: 0,
                added: 0,
                removed: 0,
                optimized: 0,
                failed: 0,
                bytes_saved: 0
            }
        };
    }

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
     * Get image with on-the-fly optimization
     * @param hash - Hash of the image file
     * @returns Optimized image buffer or null if not found
     */
    async getImage(hash: string) {
        const mediasPath = path.join(cwd(), "medias", "images");
        const imageFullpath = path.join(mediasPath, hash);

        if (!fs.existsSync(imageFullpath))
            return null;

        try {
            const originalStats = fs.statSync(imageFullpath);
            const originalSize = originalStats.size;
            const format = path.extname(imageFullpath).substring(1).toLowerCase();
            const isOptimizableFormat = ['jpeg', 'jpg', 'png', 'webp', 'avif'].includes(format);

            if (!isOptimizableFormat)
                return fs.readFileSync(imageFullpath);

            const imageBuffer = fs.readFileSync(imageFullpath);

            //@ts-ignore
            let processor = sharp(imageBuffer);
            const metadata = await processor.metadata();

            if (metadata.size && metadata.size < 10 * 1024)
                return imageBuffer;

            switch (format) {
                case 'webp':
                    processor = processor.webp({
                        quality: 60,
                        lossless: false,
                        effort: 4
                    });
                    break;
                case 'jpeg':
                case 'jpg':
                    processor = processor.jpeg({
                        quality: 60,
                        progressive: true,
                        mozjpeg: true
                    });
                    break;
                case 'png':
                    processor = processor.png({
                        quality: 60,
                        compressionLevel: 9,
                        progressive: false,
                        adaptiveFiltering: true,
                        palette: metadata.width && metadata.width < 1000 ? true : false // Use palette for smaller images
                    });
                    break;
                case 'avif':
                    processor = processor.avif({
                        quality: 60,
                        lossless: false,
                        effort: 7
                    });
                    break;
                default:
                    // Use default settings if format is not recognized
                    break;
            }

            const optimizedBuffer = await processor.toBuffer();

            if (optimizedBuffer.length < originalSize * 0.9) {
                console.log(`Optimized image ${hash}: ${originalSize} -> ${optimizedBuffer.length} bytes (${Math.round((1 - optimizedBuffer.length / originalSize) * 100)}% reduction)`);

                fs.writeFileSync(imageFullpath, optimizedBuffer);

                const MediasEntity = Repository.getEntity("MediasEntity");

                await Repository.update(MediasEntity, { sha1: hash.split('.')[0] }, {
                    size: optimizedBuffer.length
                }).catch(err => console.error('Failed to update media record:', err));

                return optimizedBuffer;
            }

            return imageBuffer;
        } catch (error) {
            console.error(`Error optimizing image ${hash}:`, error);
            return fs.readFileSync(imageFullpath);
        }
    }

    /**
     * Get medias
     * @param queries - Queries
     * @returns Medias
     */
    async getMedias(queries: any){
        const MediasEntity = Repository.getEntity("MediasEntity");
        delete queries.type;

        if(queries.type === "image")
            queries.format = In(["webp", "jpeg", "jpg", "png", "avif", "gif", "svg", "svg+xml"]);
        else if(queries.type === "video")
            queries.format = In(["mp4", "webm", "ogg", "mov", "avi", "wmv", "flv", "mkv", "m4v", "3gp", "3g2", "m3u8", "m3u"]);

        const medias = await Repository.findAll(MediasEntity, queries);
        const apiUrl = Config.get<string>("blog.url", process.env.API_URL);
        const mediasPath = path.join(cwd(), "medias", "images");

        for(const media of medias?.data){
            if (media.sha1 && media.format) {
                const hashFilePath = path.join(mediasPath, `${media.sha1}.${media.format}`);
                if (fs.existsSync(hashFilePath)) {
                    media.url = `${apiUrl}/images/${media.sha1}.${media.format}`;
                    continue;
                }
            }

            if (media.filepath) {
                const filename = path.basename(media.filepath);
                media.url = `${apiUrl}/images/${filename}`;
            } else {
                console.warn(`Media ${media.id} does not have a valid filepath or hash+format`);

                if (media.sha1 && media.format)
                    media.url = `${apiUrl}/images/${media.sha1}.${media.format}`;
                else
                    media.url = null;
            }
        }

        return medias;
    }

    /**
     * Update media
     * @param id - ID
     * @param data - Data
     * @returns True if updated
     */
    async updateMedia(id: number, data: {
        alt: string;
        caption: string;
    }) {
        const MediasEntity = Repository.getEntity("MediasEntity");
        const media = await Repository.findOne(MediasEntity, { id });

        if(!media)
            throw new Error("Media not found");

        await Repository.update(MediasEntity, { id }, {
            alt: data.alt,
            caption: data.caption
        });

        return { result: true };
    }

    /**
     * Delete media
     * @param id - ID
     * @returns True if deleted
     */
    async deleteMedia(id: number) {
        const MediasEntity = Repository.getEntity("MediasEntity");
        const media = await Repository.findOne(MediasEntity, { id });

        if(!media)
            throw new Error("Media not found");

        if(media.filepath && fs.existsSync(media.filepath))
            await fs.unlinkSync(media.filepath);

        await Repository.delete(MediasEntity, { id });

        return { result: true };
    }

    /**
     * Clean up orphaned media records in the database
     * This removes database entries that don't have corresponding files in the media directory
     * @param forceCleanup Force removal of orphaned records without looking for alternative files
     * @returns Statistics about the cleanup operation
     */
    async cleanupOrphanedRecords(forceCleanup: boolean = false) {
        this.resetProgress();
        MediasService.reprocessProgress.status = 'processing';
        MediasService.reprocessProgress.message = 'Scanning for orphaned database records...';
        MediasService.reprocessProgress.details.removed = 0;

        const mediasPath = path.join(cwd(), "medias", "images");

        if (!fs.existsSync(mediasPath)) {
            await fs.promises.mkdir(mediasPath, { recursive: true });

            MediasService.reprocessProgress.status = 'completed';
            MediasService.reprocessProgress.message = 'Media directory created, no cleanup needed.';

            return {
                success: true,
                message: "Media directory created, no cleanup needed.",
                removed: 0
            };
        }

        const files = await fs.promises.readdir(mediasPath);
        const physicalFiles = new Set(files);
        const physicalFilePaths = new Set();

        for (const file of files) {
            physicalFilePaths.add(path.join(mediasPath, file));
            physicalFilePaths.add(file);
        }

        const MediasEntity = Repository.getEntity("MediasEntity");

        try {
            const allMediasResult = await Repository.findAll(MediasEntity, {
                limit: 10000
            });
            const allMedias = allMediasResult?.data || [];

            if (allMedias.length === 0) {
                MediasService.reprocessProgress.status = 'completed';
                MediasService.reprocessProgress.message = 'No media records found in database.';

                return {
                    success: true,
                    message: "No media records found in database.",
                    removed: 0
                };
            }

            console.log(`Found ${allMedias.length} media records in database. Checking for orphaned entries...`);
            MediasService.reprocessProgress.message = `Found ${allMedias.length} media records in database. Checking for orphaned entries...`;
            MediasService.reprocessProgress.total = allMedias.length;
            MediasService.reprocessProgress.processed = 0;

            const orphanedRecords: string[] = [];
            const validRecords: any[] = [];

            for (let i = 0; i < allMedias.length; i++) {
                const media = allMedias[i];

                MediasService.reprocessProgress.processed = i + 1;

                if (i % 100 === 0 || i === allMedias.length - 1) {
                    MediasService.reprocessProgress.message = `Checking media records: ${i+1} of ${allMedias.length}`;
                    console.log(`Progress: ${i+1}/${allMedias.length} records checked`);
                }

                if (media.filepath && fs.existsSync(media.filepath)) {
                    validRecords.push(media);
                    continue;
                }

                if (media.sha1 && media.format) {
                    const expectedFilename = `${media.sha1}.${media.format}`;
                    if (physicalFiles.has(expectedFilename)) {
                        const correctPath = path.join(mediasPath, expectedFilename);
                        await Repository.update(MediasEntity, { id: media.id }, {
                            filepath: correctPath
                        });
                        validRecords.push(media);
                        continue;
                    }
                }

                if (media.filepath) {
                    const filename = path.basename(media.filepath);
                    if (physicalFiles.has(filename)) {
                        const correctPath = path.join(mediasPath, filename);
                        await Repository.update(MediasEntity, { id: media.id }, {
                            filepath: correctPath
                        });
                        validRecords.push(media);
                        continue;
                    }
                }

                if (!forceCleanup) {
                    const possibleFilepaths: string[] = [];

                    if (media.sha1) {
                        const commonExtensions = ['webp', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'avif'];

                        if (media.format)
                            possibleFilepaths.push(path.join(mediasPath, `${media.sha1}.${media.format}`));

                        for (const ext of commonExtensions)
                            possibleFilepaths.push(path.join(mediasPath, `${media.sha1}.${ext}`));
                    }

                    if (media.filepath) {
                        const filename = path.basename(media.filepath);
                        const baseName = path.parse(filename).name;
                        const ext = path.parse(filename).ext.substring(1);

                        possibleFilepaths.push(path.join(mediasPath, filename));
                        const commonExtensions = ['webp', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'avif'];

                        for (const e of commonExtensions) {
                            if (e !== ext)
                                possibleFilepaths.push(path.join(mediasPath, `${baseName}.${e}`));
                        }
                    }

                    let fileExists = false;
                    let foundPath = '';

                    for (const filepath of possibleFilepaths) {
                        if (fs.existsSync(filepath)) {
                            await Repository.update(MediasEntity, { id: media.id }, {
                                filepath: filepath
                            });
                            fileExists = true;
                            foundPath = filepath;
                            break;
                        }
                    }

                    if (fileExists) {
                        validRecords.push({...media, filepath: foundPath});
                        continue;
                    }
                }

                orphanedRecords.push(media.id);
            }

            if (orphanedRecords.length > 0) {
                MediasService.reprocessProgress.message = `Removing ${orphanedRecords.length} orphaned database records...`;
                const batchSize = 100;

                for (let i = 0; i < orphanedRecords.length; i += batchSize) {
                    const batch = orphanedRecords.slice(i, i + batchSize);
                    await Repository.delete(MediasEntity, { id: In(batch) as any });
                }

                MediasService.reprocessProgress.details.removed = orphanedRecords.length;
            }

            const resultMessage = `Cleanup completed: ${orphanedRecords.length} orphaned records removed from database (${validRecords.length} valid records kept). Started with ${allMedias.length} total records, now have ${validRecords.length}.`;
            MediasService.reprocessProgress.status = 'completed';
            MediasService.reprocessProgress.message = resultMessage;

            return {
                success: true,
                message: resultMessage,
                removed: orphanedRecords.length,
                valid: validRecords.length,
                total: allMedias.length
            };

        } catch (error: any) {
            console.error('Error during cleanup of orphaned records:', error);
            MediasService.reprocessProgress.status = 'error';
            MediasService.reprocessProgress.message = `Error: ${error.message || 'Unknown error during cleanup'}`;

            throw error;
        }
    }

    /**
     * Remove duplicate images with numeric suffixes (-1, -2, etc.)
     * @returns Statistics about the removed duplicates
     */
    async cleanupDuplicatedImages() {
        interface FileInfo {
            filename: string;
            fullPath: string;
            duplicates: DuplicateFile[];
        }

        interface DuplicateFile {
            filename: string;
            fullPath: string;
            originalFilename: string;
            originalFullPath: string;
            suffix: number;
        }

        this.resetProgress();
        MediasService.reprocessProgress.status = 'processing';
        MediasService.reprocessProgress.message = 'Scanning for duplicate images with numeric suffixes...';

        const mediasPath = path.join(cwd(), "medias", "images");
        const MediasEntity = Repository.getEntity("MediasEntity");

        if (!fs.existsSync(mediasPath)) {
            await fs.promises.mkdir(mediasPath, { recursive: true });

            MediasService.reprocessProgress.status = 'completed';
            MediasService.reprocessProgress.message = 'Media directory created, no cleanup needed.';

            return {
                success: true,
                message: "Media directory created, no cleanup needed.",
                removed: 0
            };
        }

        const files = await fs.promises.readdir(mediasPath);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase().substring(1);
            return ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg'].includes(ext);
        });

        MediasService.reprocessProgress.message = `Found ${imageFiles.length} image files. Checking for duplicates...`;
        MediasService.reprocessProgress.total = imageFiles.length;
        MediasService.reprocessProgress.processed = 0;

        const fileMap = new Map<string, FileInfo>();
        const duplicateRegex = /^(.+)-(\d+)(\..+)$/;

        for (const file of imageFiles) {
            const match = file.match(duplicateRegex);

            if (!match) {
                const baseName = path.parse(file).name;
                const ext = path.parse(file).ext;
                fileMap.set(baseName + ext, {
                    filename: file,
                    fullPath: path.join(mediasPath, file),
                    duplicates: []
                });
            }

            MediasService.reprocessProgress.processed++;
        }

        MediasService.reprocessProgress.processed = 0;
        MediasService.reprocessProgress.message = "Identifying duplicate files...";

        const duplicatesToRemove: DuplicateFile[] = [];

        for (const file of imageFiles) {
            const match = file.match(duplicateRegex);
            if (match) {
                const originalBaseName = match[1];
                const suffix = match[2];
                const ext = match[3];
                const originalFilename = originalBaseName + ext;

                if (fileMap.has(originalFilename)) {
                    const originalFileInfo = fileMap.get(originalFilename)!;

                    const duplicate: DuplicateFile = {
                        filename: file,
                        fullPath: path.join(mediasPath, file),
                        originalFilename,
                        originalFullPath: originalFileInfo.fullPath,
                        suffix: parseInt(suffix)
                    };

                    duplicatesToRemove.push(duplicate);
                    originalFileInfo.duplicates.push(duplicate);
                    console.log(`Found duplicate: ${file} (original: ${originalFilename})`);
                } else {
                    fileMap.set(originalBaseName + "-" + suffix + ext, {
                        filename: file,
                        fullPath: path.join(mediasPath, file),
                        duplicates: []
                    });
                }
            }

            MediasService.reprocessProgress.processed++;
        }

        MediasService.reprocessProgress.processed = 0;
        MediasService.reprocessProgress.total = duplicatesToRemove.length;
        MediasService.reprocessProgress.message = `Found ${duplicatesToRemove.length} duplicate files. Removing...`;

        let removedCount = 0;

        for (let i = 0; i < duplicatesToRemove.length; i++) {
            const duplicate = duplicatesToRemove[i];
            MediasService.reprocessProgress.processed = i + 1;

            try {
                const recordsUsingDuplicate = await Repository.findAll(MediasEntity, {
                    filepath: duplicate.fullPath
                });

                if (recordsUsingDuplicate && recordsUsingDuplicate.data && recordsUsingDuplicate.data.length > 0) {
                    for (const record of recordsUsingDuplicate.data) {
                        await Repository.update(MediasEntity, { id: record.id }, {
                            filepath: duplicate.originalFullPath
                        });
                    }
                }

                await fs.promises.unlink(duplicate.fullPath);
                removedCount++;

            } catch (error) {
                console.error(`Error removing duplicate ${duplicate.filename}:`, error);
            }
        }

        const resultMessage = `Cleanup completed: ${removedCount} duplicate files removed from ${duplicatesToRemove.length} identified.`;
        console.log(resultMessage);

        MediasService.reprocessProgress.status = 'completed';
        MediasService.reprocessProgress.message = resultMessage;

        return {
            success: true,
            message: resultMessage,
            removed: removedCount,
            identified: duplicatesToRemove.length
        };
    }

    /**
     * Reprocess all images in the media directory
     * - Remove database records that don't have corresponding files
     * - Add records for files that exist but aren't in the database
     * - Optimize all images for better performance
     * @returns Statistics about the operation
     */
    async reprocessAllImages() {
        this.resetProgress();
        MediasService.reprocessProgress.status = 'processing';
        MediasService.reprocessProgress.message = 'Starting image reprocessing...';

        const mediasPath = path.join(cwd(), "medias", "images");

        if (!fs.existsSync(mediasPath)) {
            await fs.promises.mkdir(mediasPath, { recursive: true });

            MediasService.reprocessProgress.status = 'completed';
            MediasService.reprocessProgress.message = 'Media directory created, no images to process.';

            return {
                success: true,
                message: "Media directory created, no images to process.",
                stats: { scanned: 0, added: 0, removed: 0, optimized: 0, failed: 0, bytes_saved: 0 }
            };
        }

        MediasService.reprocessProgress.message = 'Cleaning up duplicated images...';
        const duplicatesResult = await this.cleanupDuplicatedImages();

        MediasService.reprocessProgress.message = 'Cleaning up orphaned database records...';
        const cleanupResult = await this.cleanupOrphanedRecords();

        const files = await fs.promises.readdir(mediasPath);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase().substring(1);
            return ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg'].includes(ext);
        });

        MediasService.reprocessProgress.message = `Found ${imageFiles.length} image files to process.`;
        MediasService.reprocessProgress.total = imageFiles.length;
        MediasService.reprocessProgress.processed = 0;

        const MediasEntity = Repository.getEntity("MediasEntity");
        const allMediasResult = await Repository.findAll(MediasEntity, {});
        const allMedias = allMediasResult?.data || [];

        const fileHashMap = new Map();
        const filePathMap = new Map();

        for (const file of imageFiles) {
            const fullPath = path.join(mediasPath, file);
            const fileStats = fs.statSync(fullPath);

            if (!fileStats.isFile()) continue;

            const fileParts = path.parse(file);

            if (/^[a-f0-9]{40}$/i.test(fileParts.name))
                fileHashMap.set(fileParts.name, file);

            filePathMap.set(fullPath, file);
        }

        const dbHashMap = new Map();
        const dbPathMap = new Map();

        for (const media of allMedias) {
            if (media.sha1)
                dbHashMap.set(media.sha1, media);

            if (media.filepath)
                dbPathMap.set(media.filepath, media);
        }

        const stats = {
            scanned: imageFiles.length,
            added: 0,
            removed: cleanupResult.removed,
            optimized: 0,
            failed: 0,
            bytes_saved: 0
        };

        MediasService.reprocessProgress.details = stats;

        for (const [hash, filename] of fileHashMap.entries()) {
            try {
                MediasService.reprocessProgress.message = `Processing image: ${filename}`;
                const fullPath = path.join(mediasPath, filename);
                const fileStats = fs.statSync(fullPath);
                const originalSize = fileStats.size;
                const ext = path.extname(filename).substring(1).toLowerCase();
                const existingMediaByHash = dbHashMap.get(hash);

                if (existingMediaByHash && existingMediaByHash.filepath !== fullPath) {
                    await Repository.update(MediasEntity, { id: existingMediaByHash.id }, {
                        filepath: fullPath,
                        format: ext
                    });
                    console.log(`Updated filepath for hash ${hash}: ${fullPath}`);
                }

                const imageBuffer = fs.readFileSync(fullPath);

                if (originalSize < 5 * 1024) {
                    if (!existingMediaByHash) {
                        try {
                            //@ts-ignore
                            const metadata = await sharp(imageBuffer).metadata();
                            await Repository.insert(MediasEntity, {
                                sha1: hash,
                                filepath: fullPath,
                                format: ext,
                                width: metadata.width,
                                height: metadata.height,
                                size: originalSize,
                                alt: '',
                                caption: ''
                            });
                            stats.added++;
                            MediasService.reprocessProgress.details.added = stats.added;
                        } catch (error) {
                            console.error(`Error processing small image ${filename}:`, error);
                            stats.failed++;
                            MediasService.reprocessProgress.details.failed = stats.failed;
                        }
                    }

                    MediasService.reprocessProgress.processed++;
                    continue;
                }

                await this.optimizeImage(hash, fullPath, filename, ext, imageBuffer, originalSize, existingMediaByHash, stats);

            } catch (error) {
                console.error(`Failed to process file ${filename}:`, error);
                stats.failed++;
                MediasService.reprocessProgress.details.failed = stats.failed;
            }

            MediasService.reprocessProgress.processed++;
        }

        const processedPaths = new Set();

        for (const [filepath, filename] of filePathMap.entries()) {
            const fileParts = path.parse(filename);

            if (/^[a-f0-9]{40}$/i.test(fileParts.name)) {
                processedPaths.add(filepath);
                continue;
            }

            if (processedPaths.has(filepath))
                continue;

            try {
                MediasService.reprocessProgress.message = `Processing imported image: ${filename}`;
                const fullPath = filepath;
                const fileStats = fs.statSync(fullPath);
                const originalSize = fileStats.size;
                const ext = path.extname(filename).substring(1).toLowerCase();
                const existingMediaByPath = dbPathMap.get(fullPath);
                const imageBuffer = fs.readFileSync(fullPath);

                const contentHash = crypto.createHash('sha1').update(imageBuffer).digest('hex');
                const existingMediaByHash = dbHashMap.get(contentHash);

                if (existingMediaByHash && existingMediaByPath && existingMediaByHash.id !== existingMediaByPath.id) {
                    await Repository.update(MediasEntity, { id: existingMediaByPath.id }, {
                        sha1: contentHash
                    });

                    await Repository.delete(MediasEntity, { id: existingMediaByHash.id });
                    const mediaToUse = existingMediaByPath;

                    await this.optimizeImage(contentHash, fullPath, filename, ext, imageBuffer, originalSize, mediaToUse, stats);
                } else if (existingMediaByHash && !existingMediaByPath) {
                    await Repository.update(MediasEntity, { id: existingMediaByHash.id }, {
                        filepath: fullPath
                    });

                    await this.optimizeImage(contentHash, fullPath, filename, ext, imageBuffer, originalSize, existingMediaByHash, stats);
                } else if (!existingMediaByHash && existingMediaByPath) {
                    await Repository.update(MediasEntity, { id: existingMediaByPath.id }, {
                        sha1: contentHash
                    });

                    await this.optimizeImage(contentHash, fullPath, filename, ext, imageBuffer, originalSize, existingMediaByPath, stats);
                } else {
                    if (originalSize < 5 * 1024) {
                        if (!existingMediaByHash && !existingMediaByPath) {
                            try {
                                //@ts-ignore
                                const metadata = await sharp(imageBuffer).metadata();
                                await Repository.insert(MediasEntity, {
                                    sha1: contentHash,
                                    filepath: fullPath,
                                    format: ext,
                                    width: metadata.width,
                                    height: metadata.height,
                                    size: originalSize,
                                    alt: '',
                                    caption: ''
                                });
                                stats.added++;
                                MediasService.reprocessProgress.details.added = stats.added;
                            } catch (error) {
                                console.error(`Error processing small imported image ${filename}:`, error);
                                stats.failed++;
                                MediasService.reprocessProgress.details.failed = stats.failed;
                            }
                        }
                    } else {
                        const mediaToUse = existingMediaByHash || existingMediaByPath;
                        await this.optimizeImage(contentHash, fullPath, filename, ext, imageBuffer, originalSize, mediaToUse, stats);
                    }
                }

                processedPaths.add(filepath);

            } catch (error) {
                console.error(`Failed to process imported file ${filename}:`, error);
                stats.failed++;
                MediasService.reprocessProgress.details.failed = stats.failed;
            }

            MediasService.reprocessProgress.processed++;
        }

        const megabytes_saved = (stats.bytes_saved / (1024 * 1024)).toFixed(2);
        const resultMessage = `Processed ${stats.scanned} images: ${stats.optimized} optimized, ${stats.added} added to DB, ${stats.removed} removed from DB, ${stats.failed} failed. Total space saved: ${megabytes_saved} MB`;

        MediasService.reprocessProgress.status = 'completed';
        MediasService.reprocessProgress.message = resultMessage;

        return {
            success: true,
            message: resultMessage,
            stats
        };
    }

    /**
     * Helper method to optimize an image with Sharp
     * @param hash The hash (sha1) of the image
     * @param fullPath The full path to the image file
     * @param filename The filename of the image
     * @param ext The extension/format of the image
     * @param imageBuffer The buffer containing the image data
     * @param originalSize The original size of the image
     * @param existingMedia Existing media record if any
     * @param stats Statistics object to update
     */
    private async optimizeImage(
        hash: string,
        fullPath: string,
        filename: string,
        ext: string,
        imageBuffer: Buffer,
        originalSize: number,
        existingMedia: any,
        stats: any
    ) {
        try {
            const MediasEntity = Repository.getEntity("MediasEntity");

            //@ts-ignore
            let processor = sharp(imageBuffer);
            const metadata = await processor.metadata();

            switch (ext) {
                case 'webp':
                    processor = processor.webp({
                        quality: 60,
                        lossless: false,
                        effort: 4
                    });
                    break;
                case 'jpeg':
                case 'jpg':
                    processor = processor.jpeg({
                        quality: 60,
                        progressive: true,
                        mozjpeg: true
                    });
                    break;
                case 'png':
                    processor = processor.png({
                        quality: 60,
                        compressionLevel: 9,
                        progressive: false,
                        adaptiveFiltering: true,
                        palette: metadata.width && metadata.width < 1000 ? true : false
                    });
                    break;
                case 'avif':
                    processor = processor.avif({
                        quality: 60,
                        lossless: false,
                        effort: 7
                    });
                    break;
                default:
                    // For other formats, just get metadata
                    break;
            }

            if (['webp', 'jpeg', 'jpg', 'png', 'avif'].includes(ext)) {
                const optimizedBuffer = await processor.toBuffer();

                if (optimizedBuffer.length < originalSize * 0.95) {
                    await fs.promises.writeFile(fullPath, optimizedBuffer);
                    stats.bytes_saved += (originalSize - optimizedBuffer.length);
                    stats.optimized++;
                    MediasService.reprocessProgress.details.bytes_saved = stats.bytes_saved;
                    MediasService.reprocessProgress.details.optimized = stats.optimized;

                    if (existingMedia) {
                        await Repository.update(MediasEntity, { id: existingMedia.id }, {
                            size: optimizedBuffer.length,
                            width: metadata.width,
                            height: metadata.height,
                            filepath: fullPath,
                            sha1: hash,
                            format: ext
                        });
                    } else {
                        await Repository.insert(MediasEntity, {
                            sha1: hash,
                            filepath: fullPath,
                            format: ext,
                            width: metadata.width,
                            height: metadata.height,
                            size: optimizedBuffer.length,
                            alt: '',
                            caption: ''
                        });
                        stats.added++;
                        MediasService.reprocessProgress.details.added = stats.added;
                    }
                } else {
                    if (!existingMedia) {
                        await Repository.insert(MediasEntity, {
                            sha1: hash,
                            filepath: fullPath,
                            format: ext,
                            width: metadata.width,
                            height: metadata.height,
                            size: originalSize,
                            alt: '',
                            caption: ''
                        });
                        stats.added++;
                        MediasService.reprocessProgress.details.added = stats.added;
                    } else {
                        await Repository.update(MediasEntity, { id: existingMedia.id }, {
                            filepath: fullPath,
                            sha1: hash,
                            format: ext
                        });
                    }
                }
            } else {
                if (!existingMedia) {
                    await Repository.insert(MediasEntity, {
                        sha1: hash,
                        filepath: fullPath,
                        format: ext,
                        width: metadata.width || 0,
                        height: metadata.height || 0,
                        size: originalSize,
                        alt: '',
                        caption: ''
                    });
                    stats.added++;
                    MediasService.reprocessProgress.details.added = stats.added;
                } else {
                    await Repository.update(MediasEntity, { id: existingMedia.id }, {
                        filepath: fullPath,
                        sha1: hash,
                        format: ext
                    });
                }
            }
        } catch (error) {
            console.error(`Error optimizing image ${filename}:`, error);
            stats.failed++;
            MediasService.reprocessProgress.details.failed = stats.failed;

            if (!existingMedia) {
                try {
                    const MediasEntity = Repository.getEntity("MediasEntity");
                    await Repository.insert(MediasEntity, {
                        sha1: hash,
                        filepath: fullPath,
                        format: ext,
                        size: originalSize,
                        alt: '',
                        caption: ''
                    });
                    stats.added++;
                    MediasService.reprocessProgress.details.added = stats.added;
                } catch (err) {
                    console.error(`Failed to add record for ${filename}:`, err);
                }
            }
        }
    }
}
