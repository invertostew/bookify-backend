import pool from "../database";
import Logger from "../classes/logger/Logger";
import DatabaseError from "../classes/base_errors/DatabaseError";
import NotFoundError from "../classes/base_errors/user_facing_errors/NotFoundError";

const { APP_URL } = process.env;
const logger = new Logger("database_logs.txt");

export interface Calendar {
  id?: number;
  title: string;
  booking_id: number;
}

export class CalendarStore {
  private DATABASE_TABLE = "calendars";

  public async index(): Promise<Calendar[]> {}

  public async show(id: number): Promise<Calendar> {}

  public async create(calendar: Calendar): Promise<Calendar> {}

  public async update(calendar: Calendar): Promise<Calendar> {}

  public async destroy(id: number): Promise<Calendar> {}
}
