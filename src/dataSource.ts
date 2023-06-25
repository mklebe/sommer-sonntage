import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Category } from './categories/category.entity';

const postgresConnectionOptions: PostgresConnectionOptions = {
  type: 'postgres',
  logging: true,
  entities: [Category],
  migrations: [],
  migrationsRun: true,
};

export function getPostgresDataSource(config) {
  return new DataSource({ ...postgresConnectionOptions, ...config });
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
