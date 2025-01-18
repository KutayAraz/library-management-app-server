import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

@Entity()
export class BookRating {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.ratings)
  user!: User;

  @ManyToOne(() => Book, book => book.ratings)
  book!: Book;

  @Column()
  score!: number;
}
