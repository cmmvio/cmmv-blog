"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesModule = void 0;
const core_1 = require("@cmmv/core");
const contracts_1 = require("../../contracts");
const categories_controller_1 = require("./categories.controller");
const categories_service_1 = require("./categories.service");
exports.CategoriesModule = new core_1.Module('blog_categories', {
    contracts: [contracts_1.CategoriesContract],
    controllers: [categories_controller_1.CategoriesPublicController],
    providers: [categories_service_1.CategoriesPublicService]
});
//# sourceMappingURL=categories.modules.js.map