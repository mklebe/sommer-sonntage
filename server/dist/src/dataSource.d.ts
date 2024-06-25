import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
export declare function getPostgresDataSource(config: any): DataSource;
export declare function createTypeOrmConfig(config: ConfigService, databaseConnectionString: string): Partial<TypeOrmModuleOptions>;
declare const _default: DataSource;
export default _default;
