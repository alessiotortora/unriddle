import { content } from './content';
import { createdAt, updatedAt } from '@/utils/common-fields';
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const blogPosts = pgTable('blog_posts', {
  contentId: uuid()
    .primaryKey()
    .references(() => content.id, { onDelete: 'cascade' }),
  author: varchar({ length: 256 }),
  body: text().notNull(),
  createdAt,
  updatedAt,
});

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  content: one(content, {
    fields: [blogPosts.contentId],
    references: [content.id],
  }),
}));
