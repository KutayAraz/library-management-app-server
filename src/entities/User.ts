import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BookLending } from "./BookLending";
import { BookRating } from "./BookRating";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => BookLending, lending => lending.user)
  lendings!: BookLending[];

  @OneToMany(() => BookRating, rating => rating.user)
  ratings!: BookRating[];
}
