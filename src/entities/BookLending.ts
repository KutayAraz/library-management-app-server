import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

@Entity()
export class BookLending {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.lendings)
  user!: User;

  @ManyToOne(() => Book, book => book.lendings)
  book!: Book;

  @CreateDateColumn()
  borrowDate!: Date;

  @Column({ nullable: true })
  returnDate!: Date;

  @Column({ default: false })
  isReturned!: boolean;
}
