import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { BoardLineItem, Category } from './categories/category.entity';
import { AddsEndOfAiring1687728091223 } from '../migrations/1687728091223-AddsEndOfAiring';
import { AddsYearToCategory1687812788477 } from '../migrations/1687812788477-AddsYearToCategory';
import { AddBoardToCategory1687986874221 } from '../migrations/1687986874221-AddBoardToCategory';
import { AddFinishedUrlToCategoryNullable1689374094674 } from '../migrations/1689374094674-AddFinishedUrlToCategoryNullable';

const postgresConnectionOptions: PostgresConnectionOptions = {
  type: 'postgres',
  logging: ['error'],
  logger: 'file',
  entities: [Category, BoardLineItem],
  migrations: [
    AddsEndOfAiring1687728091223,
    AddsYearToCategory1687812788477,
    AddBoardToCategory1687986874221,
    AddFinishedUrlToCategoryNullable1689374094674,
  ],
  migrationsRun: true,
};

export function getPostgresDataSource(config) {
  const dataSourceConfig = { ...postgresConnectionOptions, ...config };
  return new DataSource(dataSourceConfig);
}

export function createTypeOrmConfig(
  config: ConfigService,
  databaseConnectionString: string,
): Partial<TypeOrmModuleOptions> {
  const defaultDatabaseUrl = config.getOrThrow(databaseConnectionString);
  const useSSL = false;
  const typeOrmConfig: Partial<TypeOrmModuleOptions> = {
    url: defaultDatabaseUrl,
    logging: 'all',
    retryDelay: 10_000,
    synchronize: false,
  };
  if (useSSL) {
    Object.assign(typeOrmConfig, { ssl: { rejectUnauthorized: false } });
  }

  return typeOrmConfig;
}

export default getPostgresDataSource({
  ...postgresConnectionOptions,
  url: 'postgresql://postgres:db_pass@localhost:9901/postgres',
} as any);
