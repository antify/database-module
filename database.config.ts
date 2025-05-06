import {defineDatabaseConfig} from '@antify/database';

export default defineDatabaseConfig({
  core: {
    databaseUrl: 'mongodb://core:core@localhost:27017/core',
    isSingleConnection: true,
    migrationDir: './migrations/core',
    fixturesDir: [
      'src/runtime/server/datasources/db/fixtures',
      'playground/server/datasources/db/fixtures'
    ],
  },
  tenant: {
    databaseUrl: 'mongodb://root:root@127.0.0.1:27017',
    isSingleConnection: false,
    migrationDir: './migrations/tenant',
    fixturesDir: [
      'src/runtime/server/datasources/db/fixtures',
      'playground/server/datasources/db/fixtures'
    ],
    fetchTenants: async () => [{
      id: '65b23bf98f24acdf2bdc6f7f',
      name: 'Example tenant'
    }],
  },
});
