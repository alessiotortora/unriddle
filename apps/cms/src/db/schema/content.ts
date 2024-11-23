import { images } from './images';
import { spaces } from './spaces';
import { videos } from './videos';
import { createdAt, updatedAt } from '@/utils/common-fields';
import { pgEnum, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const contentTypeEnum = pgEnum('content_type', [
  'project',
  'blogPost',
  'recipe',
]);

export const contentStatusEnum = pgEnum('content_status', [
  'draft',
  'published',
  'archived',
]);

export const content = pgTable('content', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  spaceId: uuid()
    .notNull()
    .references(() => spaces.id, { onDelete: 'cascade' }),
  title: varchar({ length: 256 }),
  description: text(),
  contentType: contentTypeEnum().notNull().default('project'),
  tags: text().array(),
  status: contentStatusEnum().default('draft'),
  coverImageId: uuid().references(() => images.id, {
    onDelete: 'set null',
  }),
  coverVideoId: uuid().references(() => videos.id, {
    onDelete: 'set null',
  }),
  createdAt,
  updatedAt,
});

export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;