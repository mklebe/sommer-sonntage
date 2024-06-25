import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddBoardToCategory1687986874221 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
