"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFinishedUrlToCategoryNullable1689374094674 = void 0;
class AddFinishedUrlToCategoryNullable1689374094674 {
    constructor() {
        this.name = 'AddFinishedUrlToCategoryNullable1689374094674';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "category"
            ADD "finishedListUrl" character varying
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "category" DROP COLUMN "finishedListUrl"
        `);
    }
}
exports.AddFinishedUrlToCategoryNullable1689374094674 = AddFinishedUrlToCategoryNullable1689374094674;
//# sourceMappingURL=1689374094674-AddFinishedUrlToCategoryNullable.js.map