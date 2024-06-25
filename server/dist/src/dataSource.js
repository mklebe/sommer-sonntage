"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTypeOrmConfig = exports.getPostgresDataSource = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./categories/category.entity");
const _1687728091223_AddsEndOfAiring_1 = require("../migrations/1687728091223-AddsEndOfAiring");
const _1687812788477_AddsYearToCategory_1 = require("../migrations/1687812788477-AddsYearToCategory");
const _1687986874221_AddBoardToCategory_1 = require("../migrations/1687986874221-AddBoardToCategory");
const _1689374094674_AddFinishedUrlToCategoryNullable_1 = require("../migrations/1689374094674-AddFinishedUrlToCategoryNullable");
const postgresConnectionOptions = {
    type: 'postgres',
    logging: false,
    logger: 'debug',
    entities: [category_entity_1.Category, category_entity_1.BoardLineItem],
    migrations: [
        _1687728091223_AddsEndOfAiring_1.AddsEndOfAiring1687728091223,
        _1687812788477_AddsYearToCategory_1.AddsYearToCategory1687812788477,
        _1687986874221_AddBoardToCategory_1.AddBoardToCategory1687986874221,
        _1689374094674_AddFinishedUrlToCategoryNullable_1.AddFinishedUrlToCategoryNullable1689374094674,
    ],
    migrationsRun: true,
};
function getPostgresDataSource(config) {
    const dataSourceConfig = Object.assign(Object.assign({}, postgresConnectionOptions), config);
    return new typeorm_1.DataSource(dataSourceConfig);
}
exports.getPostgresDataSource = getPostgresDataSource;
function createTypeOrmConfig(config, databaseConnectionString) {
    const defaultDatabaseUrl = config.getOrThrow(databaseConnectionString);
    const useSSL = false;
    const typeOrmConfig = {
        url: defaultDatabaseUrl,
        logging: 'all',
        retryDelay: 10000,
        synchronize: true,
        cache: true,
    };
    if (useSSL) {
        Object.assign(typeOrmConfig, { ssl: { rejectUnauthorized: false } });
    }
    return typeOrmConfig;
}
exports.createTypeOrmConfig = createTypeOrmConfig;
exports.default = getPostgresDataSource(Object.assign(Object.assign({}, postgresConnectionOptions), { url: 'postgresql://postgres:db_pass@localhost:9901/postgres' }));
//# sourceMappingURL=dataSource.js.map