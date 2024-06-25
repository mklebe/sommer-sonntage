import { MigrationInterface, QueryRunner } from "typeorm";

export class AddsYearToCategory1687812788477 implements MigrationInterface {
    name = 'AddsYearToCategory1687812788477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "category"
            ADD "year" integer NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "category" DROP COLUMN "year"
        `);
    }

}
