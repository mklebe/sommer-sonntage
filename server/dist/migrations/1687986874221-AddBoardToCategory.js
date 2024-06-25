"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBoardToCategory1687986874221 = void 0;
class AddBoardToCategory1687986874221 {
    constructor() {
        this.name = 'AddBoardToCategory1687986874221';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "board_line_item" (
                "id" SERIAL NOT NULL,
                "artist" character varying NOT NULL,
                "title" character varying NOT NULL,
                "placement" integer NOT NULL,
                "categoryId" integer,
                CONSTRAINT "PK_77a9432c974b4e50d2a8e9c0c95" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "board_line_item"
            ADD CONSTRAINT "FK_6f5351a8c4da5b304a7a9d5b1f1" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "board_line_item" DROP CONSTRAINT "FK_6f5351a8c4da5b304a7a9d5b1f1"
        `);
        await queryRunner.query(`
            DROP TABLE "board_line_item"
        `);
    }
}
exports.AddBoardToCategory1687986874221 = AddBoardToCategory1687986874221;
//# sourceMappingURL=1687986874221-AddBoardToCategory.js.map