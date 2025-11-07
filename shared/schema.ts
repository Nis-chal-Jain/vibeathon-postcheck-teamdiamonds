import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, date, pgEnum, serial, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const chequeStatusEnum = pgEnum("cheque_status", ["past", "today", "upcoming", "cancelled"]);

export const cheques = pgTable("cheques", {
  chequeId: serial("cheque_id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  chequeNumber: integer("cheque_number").notNull(),
  toPayee: varchar("to_payee", { length: 255 }).notNull(),
  issuedDate: date("issued_date").notNull(),
  dueDate: date("due_date").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: chequeStatusEnum("status").notNull(),
});

export const insertChequeSchema = createInsertSchema(cheques)
  .omit({
    chequeId: true,
  })
  .extend({
    amount: z.union([z.string(), z.number()]).transform((val) => String(val)),
  });

export type InsertCheque = z.infer<typeof insertChequeSchema>;
export type Cheque = typeof cheques.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
