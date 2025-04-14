import {
    Controller,
    Post, Body, Req
} from "@cmmv/http";

import {
    ImportService
} from "./imports.service";

@Controller("import")
export class ImportController {
    constructor(private readonly importService: ImportService){}

    @Post("wordpress")
    async importWordpress(@Req() req: any) {
        return this.importService.importWordpress(req.req);
    }

    @Post("ghost")
    async importGhost(@Body() data: any) {
        return this.importService.importGhost(data);
    }
}
