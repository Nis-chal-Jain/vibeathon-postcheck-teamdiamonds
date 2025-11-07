// Referenced from javascript_database blueprint
import { type User, type InsertUser, cheques, type Cheque, type InsertCheque } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCheques(filters?: {
    status?: string;
    issueStart?: string;
    issueEnd?: string;
    dueStart?: string;
    dueEnd?: string;
  }): Promise<Cheque[]>;
  createCheque(cheque: InsertCheque): Promise<Cheque>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.query.users.findMany({
      where: (users, { eq }) => eq(users.id, id),
    });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.query.users.findMany({
      where: (users, { eq }) => eq(users.username, username),
    });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(db._.schema!.users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCheques(filters?: {
    status?: string;
    issueStart?: string;
    issueEnd?: string;
    dueStart?: string;
    dueEnd?: string;
  }): Promise<Cheque[]> {
    const conditions = [];

    if (filters?.status) {
      conditions.push(eq(cheques.status, filters.status as any));
    }

    if (filters?.issueStart) {
      conditions.push(gte(cheques.issuedDate, filters.issueStart));
    }

    if (filters?.issueEnd) {
      conditions.push(lte(cheques.issuedDate, filters.issueEnd));
    }

    if (filters?.dueStart) {
      conditions.push(gte(cheques.dueDate, filters.dueStart));
    }

    if (filters?.dueEnd) {
      conditions.push(lte(cheques.dueDate, filters.dueEnd));
    }

    if (conditions.length === 0) {
      return await db.select().from(cheques).orderBy(cheques.chequeId);
    }

    return await db
      .select()
      .from(cheques)
      .where(and(...conditions))
      .orderBy(cheques.chequeId);
  }

  async createCheque(insertCheque: InsertCheque): Promise<Cheque> {
    const [cheque] = await db
      .insert(cheques)
      .values(insertCheque)
      .returning();
    return cheque;
  }
}

export const storage = new DatabaseStorage();
