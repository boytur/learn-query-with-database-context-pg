const { createPgDbContextFactory } = require('database-context-pg');

const dbContextFactory = createPgDbContextFactory({
  connectionString: 'postgres://user:password@localhost:3432/mydb',
});

module.exports = dbContextFactory;
