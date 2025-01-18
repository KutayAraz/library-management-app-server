import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Book } from "./entities/Book";
import { BookLending } from "./entities/BookLending";
import { BookRating } from "./entities/BookRating";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [User, Book, BookLending, BookRating],
  migrations: ["src/migration/**/*.ts"],
  subscribers: [],
});
