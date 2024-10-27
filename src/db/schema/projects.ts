import { content } from './content';
import { createdAt, updatedAt } from '@/utils/common-fields';
import { boolean, integer, jsonb, pgTable, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const projects = pgTable('projects', {
  contentId: uuid('content_id')
    .primaryKey()
    .references(() => content.id, { onDelete: 'cascade' }),
  year: integer('year'),
  featured: boolean('featured').default(false),
  details: jsonb('details'),
  createdAt,
  updatedAt,
});

export const projectsRelations = relations(projects, ({ one }) => ({
  content: one(content, {
    fields: [projects.contentId],
    references: [content.id],
  }),
}));
