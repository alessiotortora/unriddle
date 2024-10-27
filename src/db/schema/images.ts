import { events } from './events';
import { imagesToContent } from './images-to-content';
import { users } from './users';
import { createdAt, updatedAt } from '@/utils/common-fields';
import { jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const images = pgTable('images', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  alt: varchar('alt', { length: 256 }),
  publicId: varchar('public_id', { length: 512 }).notNull(),
  url: varchar('url', { length: 512 }).notNull(),
  resolution: jsonb('resolution'),
  format: varchar('format', { length: 256 }),
  createdAt,
  updatedAt,
});

export const imagesRelations = relations(images, ({ one, many }) => ({
  user: one(users, { fields: [images.userId], references: [users.id] }),
  content: many(imagesToContent),
  events: many(events),
}));
