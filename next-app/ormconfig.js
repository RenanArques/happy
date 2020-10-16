const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  type: isProduction ? 'postgres' : 'sqlite',
  url: isProduction ? process.env.POSTGRES_URL : undefined,
  database: isProduction
    ? undefined
    : './src/pages/api/database/database.sqlite',
  entities: ['./src/pages/api/models/*.ts'],
  migrations: ['./src/pages/api/database/migrations/*.ts'],
  cli: {
    entitiesDir: './src/pages/api/models',
    migrationsDir: './src/pages/api/database/migrations',
  },
}
