"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorsModule = void 0;
const core_1 = require("@cmmv/core");
const authors_controller_1 = require("./authors.controller");
const authors_service_1 = require("./authors.service");
exports.AuthorsModule = new core_1.Module('blog_authors', {
    controllers: [authors_controller_1.AuthorsController],
    providers: [authors_service_1.AuthorsService]
});
//# sourceMappingURL=authors.module.js.map