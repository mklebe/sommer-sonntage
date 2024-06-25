"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddsEndOfAiring1687728091223 = void 0;
class AddsEndOfAiring1687728091223 {
    constructor() {
        this.name = 'AddsEndOfAiring1687728091223';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "category" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "airingStartsAt" TIMESTAMP NOT NULL DEFAULT now(),
                "airingEndsAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "category"
        `);
    }
}
exports.AddsEndOfAiring1687728091223 = AddsEndOfAiring1687728091223;
//# sourceMappingURL=1687728091223-AddsEndOfAiring.js.map