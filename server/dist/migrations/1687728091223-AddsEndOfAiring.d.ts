import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddsEndOfAiring1687728091223 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
