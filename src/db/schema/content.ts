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
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  spaceId: uuid('space_id')
    .notNull()
    .references(() => spaces.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  contentType: contentTypeEnum().notNull().default('project'),
  tags: text('tags').array(),
  status: contentStatusEnum().default('draft'),
  coverImageId: uuid('cover_image_id').references(() => images.id, {
    onDelete: 'set null',
  }),
  coverVideoId: uuid('cover_video_id').references(() => videos.id, {
    onDelete: 'set null',
  }),
  createdAt,
  updatedAt,
});
