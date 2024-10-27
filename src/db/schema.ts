import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const roleEnum = pgEnum('role', ['guest', 'user', 'admin']);

export const contentTypeEnum = pgEnum('content_type', [
  'project',
  'blogPost',
  'recipe',
]);

export const projectStatusEnum = pgEnum('project_status', [
  'draft',
  'published',
  'archived',
]);

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

export const videoStatusEnum = pgEnum('video_status', [
  'processing',
  'ready',
  'failed',
]);

const createdAt = timestamp('created_at').notNull().defaultNow();
const updatedAt = timestamp('updated_at')
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  role: roleEnum().default('user'),
  firstName: varchar('first_name', { length: 256 }),
  lastName: varchar('last_name', { length: 256 }),
  location: varchar('location', { length: 256 }),
  bio: text('bio'),
  email: varchar('email', { length: 256 }).unique(),
  createdAt,
  updatedAt,
});

export const usersRelations = relations(users, ({ many }) => ({
  spaces: many(spaces),
  socialLinks: many(socialLinks),
}));

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

export const spaces = pgTable('spaces', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  description: text('description'),
  createdAt,
  updatedAt,
});

export const spacesRelations = relations(spaces, ({ many }) => ({
  projects: many(projects),
  events: many(events),
  videos: many(videos),
  images: many(images),
}));

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description'),
  year: integer('year'),
  tags: text('tags').array(),
  spaceId: uuid('space_id')
    .notNull()
    .references(() => spaces.id, { onDelete: 'cascade' }),
  status: projectStatusEnum().default('draft'),
  featured: boolean('featured').default(false),
  details: jsonb('details'),
  coverImageId: uuid('cover_image_id').references(() => images.id, {
    onDelete: 'set null',
  }),
  coverVideoId: uuid('cover_video_id').references(() => videos.id, {
    onDelete: 'set null',
  }),
  createdAt,
  updatedAt,
});

export const projectsRelations = relations(projects, ({ many, one }) => ({
  space: one(spaces, { fields: [projects.spaceId], references: [spaces.id] }),
  videos: many(videosToProjects),
  images: many(imagesToProjects),
}));

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
  projects: many(videosToProjects),
}));

export const images = pgTable('images', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  alt: varchar('alt', { length: 256 }),
  publicId: varchar('public_id', { length: 512 }).notNull(),
  url: varchar('url', { length: 512 }).notNull(),
  resolution: jsonb('resolution'),
  format: varchar('format', { length: 256 }),
  createdAt,
  updatedAt,
});

export const imagesRelations = relations(images, ({ one, many }) => ({
  user: one(users, { fields: [images.userId], references: [users.id] }),
  projects: many(imagesToProjects),
  events: many(events),
}));
export const videosToProjects = pgTable('videos_to_projects', {
  videoId: uuid('video_id')
    .notNull()
    .references(() => videos.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
});

export const videosToProjectsRelations = relations(
  videosToProjects,
  ({ one }) => ({
    video: one(videos, {
      fields: [videosToProjects.videoId],
      references: [videos.id],
    }),
    project: one(projects, {
      fields: [videosToProjects.projectId],
      references: [projects.id],
    }),
  }),
);

export const imagesToProjects = pgTable('images_to_projects', {
  imageId: uuid('image_id')
    .notNull()
    .references(() => images.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
});

export const imagesToProjectsRelations = relations(
  imagesToProjects,
  ({ one }) => ({
    image: one(images, {
      fields: [imagesToProjects.imageId],
      references: [images.id],
    }),
    project: one(projects, {
      fields: [imagesToProjects.projectId],
      references: [projects.id],
    }),
  }),
);
