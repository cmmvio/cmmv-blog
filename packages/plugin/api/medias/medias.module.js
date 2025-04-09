"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediasModule = void 0;
const core_1 = require("@cmmv/core");
const contracts_1 = require("../../contracts");
const medias_service_1 = require("./medias.service");
const medias_controller_1 = require("./medias.controller");
exports.MediasModule = new core_1.Module('blog_medias_public', {
    contracts: [contracts_1.MediasContract],
    providers: [medias_service_1.MediasService],
    controllers: [medias_controller_1.MediasController]
});
//# sourceMappingURL=medias.module.js.map