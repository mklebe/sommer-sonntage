import { MigrationInterface, QueryRunner } from "typeorm";

export class AddsEndOfAiring1687728091223 implements MigrationInterface {
    name = 'AddsEndOfAiring1687728091223'

    public async up(queryRunner: QueryRunner): Promise<void> {
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "category"
        `);
    }

}
