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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediasContract = void 0;
const core_1 = require("@cmmv/core");
let MediasContract = class MediasContract extends core_1.AbstractContract {
    sha1;
    filepath;
    alt;
    caption;
    format;
    width;
    height;
    size;
};
exports.MediasContract = MediasContract;
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false
    }),
    __metadata("design:type", String)
], MediasContract.prototype, "sha1", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: false
    }),
    __metadata("design:type", String)
], MediasContract.prototype, "filepath", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], MediasContract.prototype, "alt", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], MediasContract.prototype, "caption", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'string',
        nullable: true
    }),
    __metadata("design:type", String)
], MediasContract.prototype, "format", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int32',
        nullable: true
    }),
    __metadata("design:type", Number)
], MediasContract.prototype, "width", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int32',
        nullable: true
    }),
    __metadata("design:type", Number)
], MediasContract.prototype, "height", void 0);
__decorate([
    (0, core_1.ContractField)({
        protoType: 'int32',
        nullable: true
    }),
    __metadata("design:type", Number)
], MediasContract.prototype, "size", void 0);
exports.MediasContract = MediasContract = __decorate([
    (0, core_1.Contract)({
        namespace: 'Blog',
        controllerName: 'Medias',
        protoPackage: 'blog',
        subPath: '/blog',
        generateController: false,
        generateBoilerplates: false,
        auth: true,
        options: {
            moduleContract: true,
            databaseSchemaName: "blog_medias",
            databaseTimestamps: true
        }
    })
], MediasContract);
//# sourceMappingURL=medias.contract.js.map