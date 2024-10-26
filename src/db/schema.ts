import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 256 }),
  email: varchar('email', { length: 256 }).unique(),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  profileId: uuid('profile_id')
    .notNull()
    .references(() => profiles.id),
  title: varchar('title', { length: 256 }),
});

export const postsRelations = relations(posts, ({ one }) => ({
  profile: one(profiles, {
    fields: [posts.profileId],
    references: [profiles.id],
  }),
}));
