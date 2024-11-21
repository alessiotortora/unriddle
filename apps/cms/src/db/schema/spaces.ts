import { events } from './events';
import { images } from './images';
import { projects } from './projects';
import { users } from './users';
import { videos } from './videos';
import { createdAt, updatedAt } from '@/utils/common-fields';
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const spaces = pgTable('spaces', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  name: varchar({ length: 256 }).notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  description: text(),
  createdAt,
  updatedAt,
});

export const spacesRelations = relations(spaces, ({ many }) => ({
  projects: many(projects),
  events: many(events),
  videos: many(videos),
  images: many(images),
}));
