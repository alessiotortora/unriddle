import { events } from './events';
import { imagesToContent } from './images-to-content';
import { users } from './users';
import { createdAt, updatedAt } from '@/utils/common-fields';
import { jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const images = pgTable('images', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: 'cascade' }),
  alt: varchar({ length: 256 }),
  publicId: varchar({ length: 512 }).notNull(),
  url: varchar({ length: 512 }).notNull(),
  resolution: jsonb(),
  format: varchar({ length: 256 }),
  createdAt,
  updatedAt,
});

export const imagesRelations = relations(images, ({ one, many }) => ({
  user: one(users, { fields: [images.userId], references: [users.id] }),
  content: many(imagesToContent),
  events: many(events),
}));
