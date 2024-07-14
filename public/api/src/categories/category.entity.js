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
exports.BoardLineItem = exports.Category = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let Category = class Category {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Category.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => BoardLineItem, (boardLineItem) => boardLineItem.category, {
        eager: true,
    }),
    __metadata("design:type", Array)
], Category.prototype, "board", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], Category.prototype, "airingStartsAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], Category.prototype, "airingEndsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "finishedListUrl", void 0);
Category = __decorate([
    (0, typeorm_1.Entity)()
], Category);
exports.Category = Category;
let BoardLineItem = class BoardLineItem {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BoardLineItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BoardLineItem.prototype, "artist", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BoardLineItem.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BoardLineItem.prototype, "placement", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category, (category) => category.board),
    __metadata("design:type", Category)
], BoardLineItem.prototype, "category", void 0);
BoardLineItem = __decorate([
    (0, typeorm_1.Entity)()
], BoardLineItem);
exports.BoardLineItem = BoardLineItem;
//# sourceMappingURL=category.entity.js.map