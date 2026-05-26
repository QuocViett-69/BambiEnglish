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
exports.SettingSchema = exports.Setting = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Setting = class Setting {
    centerName;
    hotline;
    email;
    logoUrl;
    facebookLink;
    youtubeLink;
};
exports.Setting = Setting;
__decorate([
    (0, mongoose_1.Prop)({ default: 'Bambi English' }),
    __metadata("design:type", String)
], Setting.prototype, "centerName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '1900 8888' }),
    __metadata("design:type", String)
], Setting.prototype, "hotline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'tuvan@bambi.edu.vn' }),
    __metadata("design:type", String)
], Setting.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Setting.prototype, "logoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Setting.prototype, "facebookLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Setting.prototype, "youtubeLink", void 0);
exports.Setting = Setting = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Setting);
exports.SettingSchema = mongoose_1.SchemaFactory.createForClass(Setting);
//# sourceMappingURL=setting.schema.js.map