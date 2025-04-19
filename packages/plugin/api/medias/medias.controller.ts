import {
    Controller, Get, Param,
    Response, Queries,
    ContentType, Raw, Post,
    Body, Delete, Put
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    MediasService
} from "./medias.service";

interface ProcessImageInterface {
    image: string;
    format: string;
    maxWidth: number;
    alt: string;
    caption: string;
}

@Controller()
export class MediasController {
    constructor(private readonly mediasService: MediasService){}

    @Get("medias", { exclude: true })
    @ContentType("application/json")
    @Raw()
    async getMedias(@Queries() queries: any, @Response() res: any){
        return await this.mediasService.getMedias(queries);
    }

    @Get("images/:hash", { exclude: true })
    async get(@Param("hash") hash: string, @Response() res: any) {
        const image = await this.mediasService.getImage(hash);

        if(!image){
            res.code(404).end();
        }
        else{
            res.code(200).set({
                "Content-Type": "image/webp",
                "Cache-Control": "public, max-age=31536000, immutable",
                "Expires": new Date(Date.now() + 31536000).toUTCString()
            }).contentType("image/webp").send(image);
        }
    }

    @Post("images", { exclude: true })
    @Auth("media:process")
    @ContentType("application/json")
    @Raw()
    async processImage(@Body() body: ProcessImageInterface) {
        const url = await this.mediasService.getImageUrl(body.image, body.format, body.maxWidth, body.alt, body.caption);
        return { url };
    }

    @Put("medias/:id", { exclude: true })
    @Auth("media:update")
    async updateMedia(@Param("id") id: number, @Body() body: any) {
        return await this.mediasService.updateMedia(id, body);
    }

    @Delete("medias/:id", { exclude: true })
    @Auth("media:delete")
    async deleteMedia(@Param("id") id: number) {
        return await this.mediasService.deleteMedia(id);
    }

    @Get("reprocess-images-progress", { exclude: true })
    @Auth("media:process")
    async getReprocessProgress() {
        return await this.mediasService.getReprocessProgress();
    }

    @Get("cleanup-orphaned-media-progress", { exclude: true })
    @Auth("media:process")
    async getCleanupProgress() {
        return await this.mediasService.getReprocessProgress();
    }

    @Post("init-cleanup-progress", { exclude: true })
    @Auth("media:process")
    async initCleanupProgress() {
        return await this.mediasService.initializeProgress("cleanup");
    }

    @Post("cleanup-duplicated-images", { exclude: true })
    @Auth("media:process")
    async cleanupDuplicatedImages() {
        return await this.mediasService.cleanupDuplicatedImages();
    }

    @Post("cleanup-orphaned-media", { exclude: true })
    @Auth("media:process")
    async cleanupOrphanedMedia(@Body() body: {forceCleanup?: boolean} = {}) {
        return await this.mediasService.cleanupOrphanedRecords(body.forceCleanup || false);
    }

    @Post("reprocess-images", { exclude: true })
    @Auth("media:process")
    async reprocessImages() {
        return await this.mediasService.reprocessAllImages();
    }
}
