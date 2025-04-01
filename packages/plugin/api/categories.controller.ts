import {
    Controller, Get, RouterSchema,
    Queries, Req
} from "@cmmv/http";

import {
    Application
} from "@cmmv/core";

import {
    CategoriesPublicService
} from "./categories.service";

@Controller("api")
export class CategoriesPublicController {
    constructor(
        private readonly categoriesPublicService: CategoriesPublicService
    ){ }

    @Get("categories", {
        contract: Application.getContract("CategoriesContract"),
        schema: RouterSchema.GetAll,
        summary: "Returns all categories",
        exposeFilters: true
    })
    async get(@Queries() queries: any, @Req() req: any) {
        return this.categoriesPublicService.getAll(queries, req);
    }
}
