import { users } from './users';
import { videosToContent } from './videos-to-content';
import { createdAt, updatedAt } from '@/utils/common-fields';
import { pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const videoStatusEnum = pgEnum('video_status', [
  'processing',
  'ready',
  'failed',
]);

export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  alt: varchar('alt', { length: 256 }),
  assetId: varchar('asset_id', { length: 512 }),
  playbackId: varchar('playback_id', { length: 512 }),
  status: videoStatusEnum().default('processing'),
  identifier: varchar('identifier', { length: 512 }).unique(),
  createdAt,
  updatedAt,
});

export const videosRelations = relations(videos, ({ one, many }) => ({
  user: one(users, { fields: [videos.userId], references: [users.id] }),
  content: many(videosToContent),
}));
