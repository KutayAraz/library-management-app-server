import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BookLending } from "./BookLending";
import { BookRating } from "./BookRating";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  author!: string;

  @Column()
  year!: number;

  @OneToMany(() => BookLending, lending => lending.book)
  lendings!: BookLending[];

  @OneToMany(() => BookRating, rating => rating.book)
  ratings!: BookRating[];
}
