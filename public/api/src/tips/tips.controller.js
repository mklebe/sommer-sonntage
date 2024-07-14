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
exports.TipsController = void 0;
const common_1 = require("@nestjs/common");
let TipsController = class TipsController {
    async getAllTips(slug) {
        return [{ Matze: { Fooo: slug } }];
    }
    async getUserTip(username) {
        return {};
    }
    async setUserTip(userId) {
        return {};
    }
    async setJokerTip(userId, body) {
        return { userId: body };
    }
    async unsetJokerTip(userId, body) {
        return { userId: body };
    }
};
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TipsController.prototype, "getAllTips", null);
__decorate([
    (0, common_1.Get)(':slug/:username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TipsController.prototype, "getUserTip", null);
__decorate([
    (0, common_1.Post)(':slug/:username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TipsController.prototype, "setUserTip", null);
__decorate([
    (0, common_1.Post)(':slug/setJoker/:username'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TipsController.prototype, "setJokerTip", null);
__decorate([
    (0, common_1.Post)(':slug/unsetJoker/:username'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TipsController.prototype, "unsetJokerTip", null);
TipsController = __decorate([
    (0, common_1.Controller)('tips')
], TipsController);
exports.TipsController = TipsController;
//# sourceMappingURL=tips.controller.js.map