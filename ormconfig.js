module.exports = {
  "type": "mongodb",
  "host": "localhost",
  "port": "27017",
  "database": "file",
  "entities": [
    "src/models/entity/*.ts"
  ],
  "migrations": [
    "src/migrations/*.ts"
  ],
  "synchronize": true,
  "logging": [
    "query",
    "error"
  ],
  "cli": {
    "migrationsDir": "src/migrations"
  }
}
