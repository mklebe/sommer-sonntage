import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddFinishedUrlToCategoryNullable1689374094674 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
