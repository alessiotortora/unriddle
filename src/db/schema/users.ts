import { images } from './images';
import { socialLinks } from './social-links';
import { spaces } from './spaces';
import { videos } from './videos';
import { createdAt, updatedAt } from '@/utils/common-fields';
import { pgEnum, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const roleEnum = pgEnum('role', ['guest', 'user', 'admin']);

export const users = pgTable('users', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  role: roleEnum().default('user'),
  firstName: varchar({ length: 256 }),
  lastName: varchar({ length: 256 }),
  location: varchar({ length: 256 }),
  bio: text(),
  email: varchar({ length: 256 }).unique(),
  createdAt,
  updatedAt,
});

export const usersRelations = relations(users, ({ many }) => ({
  spaces: many(spaces),
  socialLinks: many(socialLinks),
  videos: many(videos),
  images: many(images),
}));
