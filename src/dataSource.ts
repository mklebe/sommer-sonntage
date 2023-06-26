import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Category } from './categories/category.entity';
import { AddsEndOfAiring1687728091223 } from '../migrations/1687728091223-AddsEndOfAiring';
import { AddsYearToCategory1687812788477 } from '../migrations/1687812788477-AddsYearToCategory';

const postgresConnectionOptions: PostgresConnectionOptions = {
  type: 'postgres',
  logging: true,
  entities: [Category],
  migrations: [AddsEndOfAiring1687728091223, AddsYearToCategory1687812788477],
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
