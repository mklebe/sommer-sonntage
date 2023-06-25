import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategories1687726353178 implements MigrationInterface {
    name = 'CreateCategories1687726353178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "category" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "airingStartsAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "category"
        `);
    }

}
