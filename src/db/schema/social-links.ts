import { users } from './users';
import { createdAt, updatedAt } from '@/utils/common-fields';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const socialLinks = pgTable('social_links', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  twitter: varchar('twitter', { length: 256 }),
  github: varchar('github', { length: 256 }),
  instagram: varchar('instagram', { length: 256 }),
  linkedin: varchar('linkedin', { length: 256 }),
  website: varchar('website', { length: 256 }),
  other: varchar('other', { length: 256 }),
  createdAt,
  updatedAt,
});

export const socialLinksRelations = relations(socialLinks, ({ one }) => ({
  user: one(users, { fields: [socialLinks.userId], references: [users.id] }),
}));
