"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediasController = void 0;
const http_1 = require("@cmmv/http");
const auth_1 = require("@cmmv/auth");
const medias_service_1 = require("./medias.service");
let MediasController = class MediasController {
    mediasService;
    constructor(mediasService) {
        this.mediasService = mediasService;
    }
    async getMedias(queries, res) {
        return await this.mediasService.getMedias(queries);
    }
    async get(hash, res) {
        const image = await this.mediasService.getImage(hash);
        if (!image) {
            res.code(404).end();
        }
        else {
            res.code(200).set({
                "Content-Type": "image/webp",
                "Cache-Control": "public, max-age=31536000, immutable",
                "Expires": new Date(Date.now() + 31536000).toUTCString()
            }).contentType("image/webp").send(image);
        }
    }
    async getThumbnail(hash, res) {
        const thumbnail = await this.mediasService.getThumbnail(hash);
        if (!thumbnail) {
            res.code(404).end();
        }
        else {
            res.code(200).set({
                "Content-Type": "image/webp",
                "Cache-Control": "public, max-age=31536000, immutable",
                "Expires": new Date(Date.now() + 31536000).toUTCString()
            }).contentType("image/webp").send(thumbnail);
        }
    }
    async processImage(body) {
        const url = await this.mediasService.getImageUrl(body.image, body.format, body.maxWidth, body.alt, body.caption);
        return { url };
    }
};
exports.MediasController = MediasController;
__decorate([
    (0, http_1.Get)("medias", { exclude: true }),
    (0, http_1.ContentType)("application/json"),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Queries)()),
    __param(1, (0, http_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MediasController.prototype, "getMedias", null);
__decorate([
    (0, http_1.Get)("images/:hash", { exclude: true }),
    __param(0, (0, http_1.Param)("hash")),
    __param(1, (0, http_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MediasController.prototype, "get", null);
__decorate([
    (0, http_1.Get)("thumbnails/:hash", { exclude: true }),
    __param(0, (0, http_1.Param)("hash")),
    __param(1, (0, http_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MediasController.prototype, "getThumbnail", null);
__decorate([
    (0, http_1.Post)("images", { exclude: true }),
    (0, auth_1.Auth)("media:process"),
    (0, http_1.ContentType)("application/json"),
    (0, http_1.Raw)(),
    __param(0, (0, http_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MediasController.prototype, "processImage", null);
exports.MediasController = MediasController = __decorate([
    (0, http_1.Controller)(),
    __metadata("design:paramtypes", [medias_service_1.MediasService])
], MediasController);
//# sourceMappingURL=medias.controller.js.map