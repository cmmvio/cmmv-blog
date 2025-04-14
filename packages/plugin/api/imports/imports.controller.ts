import {
    Controller,
    Post, Body, Req, Get, Param, Query
} from "@cmmv/http";

import {
    Auth
} from "@cmmv/auth";

import {
    ImportService
} from "./imports.service";

@Controller("imports")
export class ImportController {
    constructor(private readonly importService: ImportService){}

    @Post("wordpress")
    @Auth({ rootOnly: true })
    async importWordpress(@Req() req: any) {
        return this.importService.importWordpress(req.req);
    }

    @Post("ghost")
    @Auth({ rootOnly: true })
    async importGhost(@Body() data: any) {
        return this.importService.importGhost(data);
    }

    @Get("progress/:importId")
    @Auth({ rootOnly: true })
    async getImportProgress(@Param("importId") importId: string) {
        const progress = this.importService.getImportProgress(importId);

        if (!progress) {
            return {
                success: false,
                message: `Import with ID ${importId} not found`
            };
        }

        return {
            success: true,
            data: progress
        };
    }

    @Get("progress")
    @Auth({ rootOnly: true })
    async getAllActiveImports() {
        const progress = this.importService.getAllImportProgress();

        return {
            success: true,
            data: progress
        };
    }
}
