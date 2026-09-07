import {defineDatabaseConfig} from '@antify/database';
import dotenv from 'dotenv';

dotenv.config();

export default defineDatabaseConfig({
  core: {
    databaseUrl: process.env.NUXT_DB_CORE_URL as string || 'mongodb://localhost:27017/core?directConnection=true',
    isSingleConnection: true,
    migrationDir: './migrations/core',
    fixturesDir: [
      'src/runtime/server/datasources/db/fixtures',
      'playground/server/datasources/db/fixtures'
    ],
  },
  tenant: {
    databaseUrl: process.env.NUXT_DB_TENANT_URL as string || 'mongodb://localhost:27017/?directConnection=true',
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
