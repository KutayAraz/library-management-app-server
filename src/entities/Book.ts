import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
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

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => BookLending, lending => lending.book)
  lendings!: BookLending[];

  @OneToMany(() => BookRating, rating => rating.book)
  ratings!: BookRating[];
}
