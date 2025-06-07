import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import { cwd } from "node:process";
import * as sharp from "sharp";

import {
    AbstractService,
    Config, Service,
    Application
} from "@cmmv/core";

import {
    Repository, In
} from "@cmmv/repository";

import {
    BlogStorageService
} from "../storage/storage.service";

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
        maxWidth: number = 1280, // Padrão agora é 1280 (formato 16:9 com altura 720)
        alt: string = "",
        caption: string = ""
    ) {
        if(!image)
            return null;

        if(image.startsWith("http"))
            return image;

        const mediasPath = path.join(cwd(), "medias", "images");
        const blogStorageService = Application.resolveProvider(BlogStorageService);

        if(!fs.existsSync(mediasPath))
            await fs.mkdirSync(mediasPath, { recursive: true });

        // Ignoramos o formato solicitado e usamos sempre webp
        const originalFormat = format.toLowerCase();
        format = "webp"; // Forçamos sempre webp para armazenamento
        let apiUrl = Config.get<string>("blog.url", process.env.API_URL);

        if(apiUrl.endsWith("/"))
            apiUrl = apiUrl.slice(0, -1);

        // Extrair a parte base64 da imagem para calcular o hash
        let base64Data = '';
        if(/^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/.test(image)) {
            base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        }

        // Criar hash baseado no conteúdo da imagem, não no timestamp
        // Isso evita a regeneração da mesma imagem
        const contentHash = base64Data 
            ? await crypto.createHash('sha1').update(base64Data).digest('hex') 
            : await crypto.createHash('sha1').update(image).digest('hex');
            
        const imageHash = contentHash;
        const imageFullpath = path.join(mediasPath, `${imageHash}.${format}`).toLowerCase();
        const imageUrl = `${apiUrl}/images/${imageHash}.${format}`;

        // Verificar se já existe uma entrada no banco para esta imagem
        const MediasEntity = Repository.getEntity("MediasEntity");
        const existingMedia = await Repository.findOne(MediasEntity, { sha1: imageHash });
        
        // Se a imagem já existe no banco e tem URL, retornamos a URL
        if (existingMedia && existingMedia.filepath && existingMedia.filepath.startsWith('http')) {
            return existingMedia.filepath;
        }
        
        // Se a imagem já existe no sistema de arquivos, retornamos a URL
        if(fs.existsSync(imageFullpath)) {
            return imageUrl.toLowerCase();
        }

        // A partir daqui, processamos a imagem apenas se ela não existir
        const isValidImage = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/.test(image);

        if (!isValidImage) {
            console.error('Invalid image format provided');
            return null;
        }

        try {
            const buffer = Buffer.from(base64Data, 'base64');

            //@ts-ignore
            let processor = sharp(buffer);
            const metadata = await processor.metadata();

            const targetWidth = 1280;
            const targetHeight = 720;

            processor = processor.resize({
                width: targetWidth,
                height: targetHeight,
                fit: 'cover',
                position: 'center'
            });

            processor = processor.webp({
                quality: 70,
                lossless: false,
                //@ts-ignore
                reductionEffort: 6
            });

            const optimizedBuffer = await processor.toBuffer();

            const uploadedFile = await blogStorageService.uploadFile({
                buffer: optimizedBuffer,
                originalname: `${imageHash}.webp`,
                mimetype: `image/webp`
            });

            if(uploadedFile){
                //@ts-ignore
                const thumbnailBuffer = await sharp(buffer)
                    .resize(16, 16, {
                        fit: 'cover',
                        position: 'center'
                    })
                    .webp({ quality: 80 })
                    .toBuffer();

                const cleanThumbnailBuffer = Buffer.from(new Uint8Array(thumbnailBuffer));

                const uploadedThumbnail = await blogStorageService.uploadFile({
                    buffer: cleanThumbnailBuffer,
                    originalname: `${imageHash}_thumb.webp`,
                    mimetype: 'image/webp'
                });

                const media = await Repository.findOne(MediasEntity, { sha1: imageHash });

                if(media){
                    await Repository.updateOne(MediasEntity, { sha1: imageHash }, {
                        url: uploadedFile.url,
                        thumbnail: uploadedThumbnail?.url || null
                    });
                }
                else{
                    await Repository.insert(MediasEntity, {
                        sha1: imageHash,
                        filepath: uploadedFile.url,
                        name: image,
                        format: 'webp', // Sempre webp como formato final
                        originalFormat: originalFormat, // Preservamos o formato original como informação
                        width: metadata.width,
                        height: metadata.height,
                        alt: alt,
                        caption: caption,
                        size: optimizedBuffer.length,
                        thumbnail: uploadedThumbnail?.url || null
                    });
                }

                return uploadedFile.url;
            }

            const media = await Repository.findOne(MediasEntity, { sha1: imageHash });

            if(!media){
                if (metadata.width && metadata.height && metadata.width > 0 && metadata.height > 0) {
                    const thumbnailPath = path.join(mediasPath, `${imageHash}_thumb.webp`);
                    let thumbnailUrl: string | null = null;

                    try {
                        //@ts-ignore
                        const thumbnailBuffer = await sharp(buffer)
                            .resize(16, 16, {
                                fit: 'cover',
                                position: 'center'
                            })
                            .webp({ quality: 80 })
                            .toBuffer();

                        await fs.writeFileSync(thumbnailPath, thumbnailBuffer);
                        thumbnailUrl = `${apiUrl}/images/${imageHash}_thumb.webp`;
                    } catch (thumbnailError) {
                        console.error('Error creating thumbnail:', thumbnailError);
                    }

                    await Repository.insert(MediasEntity, {
                        sha1: imageHash,
                        filepath: imageFullpath,
                        name: image,
                        format: 'webp', // Sempre webp como formato final
                        originalFormat: originalFormat, // Preservamos o formato original
                        width: metadata.width,
                        height: metadata.height,
                        alt: alt,
                        caption: caption,
                        size: metadata.size,
                        thumbnail: thumbnailUrl
                    });
                } else {
                    console.error(`Invalid image dimensions (${metadata.width}x${metadata.height}) for ${imageFullpath}`);
                    return null;
                }
            } else if (!media.thumbnail) {
                const thumbnailPath = path.join(mediasPath, `${imageHash}_thumb.webp`);
                let thumbnailUrl: string | null = null;

                try {
                    //@ts-ignore
                    const thumbnailBuffer = await sharp(buffer)
                        .resize(16, 16, {
                            fit: 'cover',
                            position: 'center'
                        })
                        .webp({ quality: 80 })
                        .toBuffer();

                    await fs.writeFileSync(thumbnailPath, thumbnailBuffer);
                    thumbnailUrl = `${apiUrl}/images/${imageHash}_thumb.webp`;

                    // Update existing media with thumbnail
                    await Repository.update(MediasEntity, { sha1: imageHash }, {
                        thumbnail: thumbnailUrl
                    });
                } catch (thumbnailError) {
                    console.error('Error creating thumbnail for existing media:', thumbnailError);
                }
            }

            await processor.toFile(imageFullpath);
        } catch (error) {
            console.error('Error processing image:', error);
            return null;
        }

        return imageUrl.toLowerCase();
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

        delete queries.t;

        const medias = await Repository.findAll(MediasEntity, queries);
        const apiUrl = Config.get<string>("blog.url", process.env.API_URL);
        const mediasPath = path.join(cwd(), "medias", "images");

        for(const media of medias?.data){
            if (media.sha1 && media.format && !media.filepath.startsWith("https://")) {
                media.format = media.format.toLowerCase(); //bugfix
                const hashFilePath = path.join(mediasPath, `${media.sha1}.${media.format}`);

                if (fs.existsSync(hashFilePath)) {
                    media.url = `${apiUrl}/images/${media.sha1}.${media.format}`;
                    continue;
                }
            }

            if(media.filepath && media.filepath.startsWith("https://")){
                media.url = media.filepath;
                continue;
            }
            else if (media.filepath && !media.filepath.startsWith("https://")) {
                const filename = path.basename(media.filepath);
                media.url = `${apiUrl}/images/${filename}`;
            } else {
                if (media.sha1 && media.format)
                    media.url = `${apiUrl}/images/${media.sha1}.${media.format}`;
                else
                    media.url = null;
            }

            media.url = media.url.toLowerCase();
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

            MediasService.reprocessProgress.message = `Found ${allMedias.length} media records in database. Checking for orphaned entries...`;
            MediasService.reprocessProgress.total = allMedias.length;
            MediasService.reprocessProgress.processed = 0;

            const orphanedRecords: string[] = [];
            const validRecords: any[] = [];

            for (let i = 0; i < allMedias.length; i++) {
                const media = allMedias[i];

                MediasService.reprocessProgress.processed = i + 1;

                if (i % 100 === 0 || i === allMedias.length - 1)
                    MediasService.reprocessProgress.message = `Checking media records: ${i+1} of ${allMedias.length}`;

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
                            // Make sure width and height are valid before inserting
                            if (metadata.width && metadata.height && metadata.width > 0 && metadata.height > 0) {
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
                                console.error(`Skipping invalid image ${filename}: Missing or invalid dimensions (${metadata.width}x${metadata.height})`);
                                stats.failed++;
                                MediasService.reprocessProgress.details.failed = stats.failed;
                            }
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
                                // Make sure width and height are valid before inserting
                                if (metadata.width && metadata.height && metadata.width > 0 && metadata.height > 0) {
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
                                } else {
                                    console.error(`Skipping invalid imported image ${filename}: Missing or invalid dimensions (${metadata.width}x${metadata.height})`);
                                    stats.failed++;
                                    MediasService.reprocessProgress.details.failed = stats.failed;
                                }
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
                        // Make sure dimensions are valid
                        if (metadata.width && metadata.height && metadata.width > 0 && metadata.height > 0) {
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
                        } else {
                            console.error(`Skipping invalid image ${filename}: Missing or invalid dimensions (${metadata.width}x${metadata.height})`);
                            stats.failed++;
                            MediasService.reprocessProgress.details.failed = stats.failed;
                        }
                    }
                } else {
                    if (!existingMedia) {
                        // Make sure dimensions are valid
                        if (metadata.width && metadata.height && metadata.width > 0 && metadata.height > 0) {
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
                            console.error(`Skipping invalid image ${filename}: Missing or invalid dimensions (${metadata.width}x${metadata.height})`);
                            stats.failed++;
                            MediasService.reprocessProgress.details.failed = stats.failed;
                        }
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
                    // Make sure dimensions are valid
                    if (metadata.width && metadata.height && metadata.width > 0 && metadata.height > 0) {
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
                        console.error(`Skipping invalid image ${filename}: Missing or invalid dimensions (${metadata.width}x${metadata.height})`);
                        stats.failed++;
                        MediasService.reprocessProgress.details.failed = stats.failed;
                    }
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
                    console.error(`Cannot validate image dimensions for ${filename} due to processing error`);
                    stats.failed++;
                    MediasService.reprocessProgress.details.failed = stats.failed;
                    stats.added++;
                    MediasService.reprocessProgress.details.added = stats.added;
                } catch (err) {
                    console.error(`Failed to add record for ${filename}:`, err);
                }
            }
        }
    }

    /**
     * Import an image from a URL
     * @param url The URL of the image
     * @param alt The alt text of the image
     * @param caption The caption of the image
     * @returns The imported image
     */
    async importFromUrl(url: string, alt: string, caption: string) {
        try {
            const cleanUrl = url.split('?')[0].split('#')[0];
            const buffer = await fetch(cleanUrl).then(res => res.arrayBuffer());
            const imageBuffer = Buffer.from(buffer);
            let filename = cleanUrl.split('/').pop();

            if(filename && filename.includes("?"))
                filename = filename.split("?")[0];

            const ext = path.extname(filename || '').substring(1).toLowerCase();

            try {
                // @ts-ignore
                const metadata = await sharp(imageBuffer).metadata();

                if (!metadata.width || !metadata.height || metadata.width <= 0 || metadata.height <= 0) {
                    console.error(`Invalid image dimensions (${metadata.width}x${metadata.height}) for URL: ${cleanUrl}`);
                    return {
                        success: false,
                        message: "Invalid image: Missing or invalid dimensions",
                        url: null
                    };
                }

                // Convert to base64
                const base64 = imageBuffer.toString('base64');
                const imageUrl = `data:image/${ext};base64,${base64}`;
                const imageUrlResponse = await this.getImageUrl(imageUrl, ext, 1024, alt, caption);

                if (!imageUrlResponse) {
                    return {
                        success: false,
                        message: "Failed to process image",
                        url: null
                    };
                }

                return {
                    success: true,
                    message: "Image imported successfully",
                    url: imageUrlResponse
                };
            } catch (error) {
                console.error(`Error processing image from URL ${cleanUrl}:`, error);
                return {
                    success: false,
                    message: "Invalid image or unsupported format",
                    url: null
                };
            }
        } catch (error) {
            console.error(`Error fetching URL ${url}:`, error);
            return {
                success: false,
                message: "Failed to fetch image from URL",
                url: null
            };
        }
    }

    /**
     * Generate thumbnails for all images that don't have them
     * @returns Statistics about the thumbnail generation operation
     */
    async generateMissingThumbnails() {
        this.resetProgress();
        MediasService.reprocessProgress.status = 'processing';
        MediasService.reprocessProgress.message = 'Scanning for images without thumbnails...';

        const MediasEntity = Repository.getEntity("MediasEntity");
        const blogStorageService = Application.resolveProvider(BlogStorageService);
        const mediasPath = path.join(cwd(), "medias", "images");

        if (!fs.existsSync(mediasPath)) {
            await fs.promises.mkdir(mediasPath, { recursive: true });
        }

        try {
            // Find all media records without thumbnails
            const allMediasResult = await Repository.findAll(MediasEntity, {
                limit: 10000,
                thumbnail: null // Only get records without thumbnails
            });
            const mediasWithoutThumbnails = allMediasResult?.data || [];

            if (mediasWithoutThumbnails.length === 0) {
                MediasService.reprocessProgress.status = 'completed';
                MediasService.reprocessProgress.message = 'All images already have thumbnails.';

                return {
                    success: true,
                    message: "All images already have thumbnails.",
                    processed: 0,
                    created: 0,
                    failed: 0
                };
            }

            MediasService.reprocessProgress.message = `Found ${mediasWithoutThumbnails.length} images without thumbnails. Starting generation...`;
            MediasService.reprocessProgress.total = mediasWithoutThumbnails.length;
            MediasService.reprocessProgress.processed = 0;
            MediasService.reprocessProgress.details = {
                scanned: mediasWithoutThumbnails.length,
                added: 0,
                removed: 0,
                optimized: 0,
                failed: 0,
                bytes_saved: 0
            };

            let created = 0;
            let failed = 0;
            let apiUrl = Config.get<string>("blog.url", process.env.API_URL);

            if (apiUrl.endsWith("/")) {
                apiUrl = apiUrl.slice(0, -1);
            }

            for (let i = 0; i < mediasWithoutThumbnails.length; i++) {
                const media = mediasWithoutThumbnails[i];
                MediasService.reprocessProgress.processed = i + 1;
                MediasService.reprocessProgress.message = `Processing thumbnail ${i + 1} of ${mediasWithoutThumbnails.length}: ${media.sha1}`;

                try {
                    let imageBuffer: Buffer | null = null;

                    if (media.filepath && fs.existsSync(media.filepath)) {
                        imageBuffer = fs.readFileSync(media.filepath);
                    } else if (media.filepath && (media.filepath.startsWith('http://') || media.filepath.startsWith('https://'))) {
                        try {
                            console.log(`Fetching image from URL: ${media.filepath}`);
                            const response = await fetch(media.filepath);
                            if (!response.ok) {
                                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                            }
                            const arrayBuffer = await response.arrayBuffer();
                            imageBuffer = Buffer.from(arrayBuffer);
                        } catch (fetchError: any) {
                            console.error(`Failed to fetch image from URL ${media.filepath}:`, fetchError.message);
                            failed++;
                            MediasService.reprocessProgress.details.failed = failed;
                            continue;
                        }
                    } else if (media.sha1 && media.format) {
                        // Try to find by hash
                        const hashFilePath = path.join(mediasPath, `${media.sha1}.${media.format}`);
                        if (fs.existsSync(hashFilePath)) {
                            imageBuffer = fs.readFileSync(hashFilePath);
                            // Update the filepath in database
                            await Repository.update(MediasEntity, { id: media.id }, {
                                filepath: hashFilePath
                            });
                        }
                    }

                    if (!imageBuffer) {
                        console.error(`Could not find or fetch image file for media ID ${media.id} (filepath: ${media.filepath})`);
                        failed++;
                        MediasService.reprocessProgress.details.failed = failed;
                        continue;
                    }

                    // Validate image dimensions
                    //@ts-ignore
                    const metadata = await sharp(imageBuffer).metadata();
                    if (!metadata.width || !metadata.height || metadata.width <= 0 || metadata.height <= 0) {
                        console.error(`Invalid image dimensions for media ID ${media.id}: ${metadata.width}x${metadata.height}`);
                        failed++;
                        MediasService.reprocessProgress.details.failed = failed;
                        continue;
                    }

                    // Generate thumbnail
                    //@ts-ignore
                    const thumbnailBuffer = await sharp(imageBuffer)
                        .resize(16, 16, {
                            fit: 'cover',
                            position: 'center'
                        })
                        .webp({ quality: 80 })
                        .toBuffer();

                    let thumbnailUrl: string | null = null;

                    // Check if we should upload to external storage
                    try {
                        const cleanThumbnailBuffer = Buffer.from(new Uint8Array(thumbnailBuffer));

                        const uploadedThumbnail = await blogStorageService.uploadFile({
                            buffer: cleanThumbnailBuffer,
                            originalname: `${media.sha1}_thumb.webp`,
                            mimetype: 'image/webp'
                        });

                        if (uploadedThumbnail && uploadedThumbnail.url) {
                            thumbnailUrl = uploadedThumbnail.url;
                        }
                    } catch (uploadError: any) {
                        console.log('External storage upload failed, falling back to local storage:', uploadError.message);
                    }

                    // Fall back to local storage if external upload failed
                    if (!thumbnailUrl) {
                        const thumbnailPath = path.join(mediasPath, `${media.sha1}_thumb.webp`);
                        await fs.promises.writeFile(thumbnailPath, thumbnailBuffer);
                        thumbnailUrl = `${apiUrl}/images/${media.sha1}_thumb.webp`;
                    }

                    // Update the media record with thumbnail URL
                    await Repository.update(MediasEntity, { id: media.id }, {
                        thumbnail: thumbnailUrl
                    });

                    created++;
                    MediasService.reprocessProgress.details.added = created;

                } catch (error) {
                    console.error(`Error generating thumbnail for media ID ${media.id}:`, error);
                    failed++;
                    MediasService.reprocessProgress.details.failed = failed;
                }
            }

            const resultMessage = `Thumbnail generation completed: ${created} thumbnails created, ${failed} failed out of ${mediasWithoutThumbnails.length} images processed.`;
            MediasService.reprocessProgress.status = 'completed';
            MediasService.reprocessProgress.message = resultMessage;

            return {
                success: true,
                message: resultMessage,
                processed: mediasWithoutThumbnails.length,
                created,
                failed
            };

        } catch (error: any) {
            console.error('Error during thumbnail generation:', error);
            MediasService.reprocessProgress.status = 'error';
            MediasService.reprocessProgress.message = `Error: ${error.message || 'Unknown error during thumbnail generation'}`;

            throw error;
        }
    }
}
