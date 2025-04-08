import {
    Controller, Get, Param,
    Response, Queries,
    ContentType, Raw, Post,
    Body
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    MediasService
} from "./medias.service";

import {
    ProcessImageInterface
} from "./medias.interface";

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

    @Get("thumbnails/:hash", { exclude: true })
    async getThumbnail(@Param("hash") hash: string, @Response() res: any) {
        const thumbnail = await this.mediasService.getThumbnail(hash);

        if(!thumbnail){
            res.code(404).end();
        }
        else{
            res.code(200).set({
                "Content-Type": "image/webp",
                "Cache-Control": "public, max-age=31536000, immutable",
                "Expires": new Date(Date.now() + 31536000).toUTCString()
            }).contentType("image/webp").send(thumbnail);
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
}
