import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFinishedUrlToCategoryNullable1689374094674 implements MigrationInterface {
    name = 'AddFinishedUrlToCategoryNullable1689374094674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "category"
            ADD "finishedListUrl" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "category" DROP COLUMN "finishedListUrl"
        `);
    }

}
