import { pgTable, serial, jsonb, integer } from 'drizzle-orm/pg-core';
import type { PortfolioData } from '@/lib/data';

export const portfolios = pgTable('portfolios', {
  id: integer('id').primaryKey(),
  data: jsonb('data').$type<PortfolioData>().notNull(),
});
