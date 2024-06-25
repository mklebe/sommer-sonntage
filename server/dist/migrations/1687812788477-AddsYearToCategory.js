"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddsYearToCategory1687812788477 = void 0;
class AddsYearToCategory1687812788477 {
    constructor() {
        this.name = 'AddsYearToCategory1687812788477';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "category"
            ADD "year" integer NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "category" DROP COLUMN "year"
        `);
    }
}
exports.AddsYearToCategory1687812788477 = AddsYearToCategory1687812788477;
//# sourceMappingURL=1687812788477-AddsYearToCategory.js.map