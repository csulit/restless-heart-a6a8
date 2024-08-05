import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'mysql',
	out: 'drizzle/migrations',
	schema: 'src/database/schema.ts',
	verbose: true,
	strict: true,
});
