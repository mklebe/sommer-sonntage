import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource } from 'typeorm';

const postgresConnectionOptions: PostgresConnectionOptions = {
  type: 'postgres',
  logging: true,
  entities: [],
  migrations: [],
  migrationsRun: true,
};

function getPostgresDataSource(config) {
  return new DataSource({ ...postgresConnectionOptions, ...config });
}

function createTypeOrmConfig(
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
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createTypeOrmConfig(config, 'DB_CONNECTION_STRING'),
      dataSourceFactory: (config) => {
        return getPostgresDataSource(config).initialize();
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
