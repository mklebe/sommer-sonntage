import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddsYearToCategory1687812788477 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
