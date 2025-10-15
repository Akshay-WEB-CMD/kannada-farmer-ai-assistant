import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  location: text('location').notNull(),
  language: text('language').notNull().default('kannada'),
  createdAt: text('created_at').notNull(),
});

export const soilAnalysis = sqliteTable('soil_analysis', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  imageUrl: text('image_url').notNull(),
  soilType: text('soil_type').notNull(),
  recommendations: text('recommendations').notNull(),
  crops: text('crops', { mode: 'json' }).notNull(),
  analysisDate: text('analysis_date').notNull(),
  createdAt: text('created_at').notNull(),
});

export const chatHistory = sqliteTable('chat_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  response: text('response').notNull(),
  language: text('language').notNull(),
  createdAt: text('created_at').notNull(),
});

export const feedback = sqliteTable('feedback', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  rating: integer('rating').notNull(),
  createdAt: text('created_at').notNull(),
});