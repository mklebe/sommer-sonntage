import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBoardToCategory1687986874221 implements MigrationInterface {
    name = 'AddBoardToCategory1687986874221'

    public async up(queryRunner: QueryRunner): Promise<void> {
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "board_line_item" DROP CONSTRAINT "FK_6f5351a8c4da5b304a7a9d5b1f1"
        `);
        await queryRunner.query(`
            DROP TABLE "board_line_item"
        `);
    }

}
