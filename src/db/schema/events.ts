import { images } from './images';
import { spaces } from './spaces';
import { createdAt, updatedAt } from '@/utils/common-fields';
import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const eventTypeEnum = pgEnum('event_type', [
  'exhibition',
  'screening',
  'workshop',
  'conference',
  'meetup',
  'other',
]);
export const eventStatusEnum = pgEnum('event_status', [
  'draft',
  'scheduled',
  'ongoing',
  'completed',
  'canceled',
]);

export const events = pgTable('events', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  location: varchar('location', { length: 256 }),
  client: varchar('client', { length: 256 }),
  link: varchar('link', { length: 512 }),
  type: eventTypeEnum().default('other'),
  status: eventStatusEnum().default('draft'),
  details: jsonb('details'),
  coverImageId: uuid('cover_image_id').references(() => images.id, {
    onDelete: 'set null',
  }),
  spaceId: uuid('space_id')
    .notNull()
    .references(() => spaces.id, { onDelete: 'cascade' }),
  createdAt,
  updatedAt,
});

export const eventsRelations = relations(events, ({ one }) => ({
  space: one(spaces, { fields: [events.spaceId], references: [spaces.id] }),
  coverImage: one(images, {
    fields: [events.coverImageId],
    references: [images.id],
  }),
}));
