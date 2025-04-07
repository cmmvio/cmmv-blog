import {
    Controller, Get, Param,
    Req, Response
} from "@cmmv/http";

import {
    Application
} from "@cmmv/core";

import {
    MediasService
} from "./medias.service";

@Controller()
export class MediasController {
    constructor(
        private readonly mediasService: MediasService
    ){ }

    @Get("images/:hash", { exclude: true })
    async get(@Param("hash") hash: string, @Response() res: any) {
        const image = await this.mediasService.getImage(hash);

        if(!image){
            res.code(404).end();
        }
        else{
            res.code(200).set({
                "Content-Type": "image/webp",
                "Cache-Control": "public, max-age=31536000",
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
                "Cache-Control": "public, max-age=31536000",
                "Expires": new Date(Date.now() + 31536000).toUTCString()
            }).contentType("image/webp").send(thumbnail);
        }
    }
}
