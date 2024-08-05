import { InferSelectModel } from 'drizzle-orm';
import { mysqlTable, int, timestamp, varchar, json } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('users', {
	id: int('id').primaryKey().autoincrement(),
	clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
	email: varchar('email', { length: 100 }).notNull().unique(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
});

export type User = InferSelectModel<typeof user>;

export const property = mysqlTable('properties', {
	id: int('id').primaryKey().autoincrement(),
	jsonData: json('json').$type<{ foo: string }>(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
});

export type Property = InferSelectModel<typeof property>;
