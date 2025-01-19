import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Book } from "../entities/Book";
import { BookLending } from "../entities/BookLending";
import { BookRating } from "../entities/BookRating";

export const getUsers = async (_: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: ["id", "name"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["lendings", "lendings.book", "ratings", "ratings.book"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const presentBooks = user.lendings
      .filter(lending => !lending.isReturned)
      .map(lending => ({
        id: lending.book.id, // Include the book ID
        name: lending.book.name,
      }));

    const pastBooks = user.ratings.map(rating => ({
      id: rating.book.id, // Include the book ID
      name: rating.book.name,
      userScore: rating.score,
    }));

    return res.json({
      id: user.id,
      name: user.name,
      books: {
        past: pastBooks,
        present: presentBooks,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user" });
  }
};

export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { userId, bookId } = req.params;

    const userRepository = AppDataSource.getRepository(User);
    const bookRepository = AppDataSource.getRepository(Book);
    const lendingRepository = AppDataSource.getRepository(BookLending);

    const user = await userRepository.findOne({ where: { id: parseInt(userId) } });
    const book = await bookRepository.findOne({ where: { id: parseInt(bookId) } });

    if (!user || !book) {
      return res.status(404).json({ message: "User or Book not found" });
    }

    // Check if book is already borrowed
    const existingLending = await lendingRepository.findOne({
      where: {
        book: { id: book.id },
        isReturned: false,
      },
    });

    if (existingLending) {
      return res.status(400).json({ message: "Book is already borrowed" });
    }

    const lending = new BookLending();
    lending.user = user;
    lending.book = book;
    lending.isReturned = false;

    await lendingRepository.save(lending);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Error borrowing book" });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  try {
    const { userId, bookId } = req.params;
    const { score } = req.body;

    const lendingRepository = AppDataSource.getRepository(BookLending);
    const ratingRepository = AppDataSource.getRepository(BookRating);

    const lending = await lendingRepository.findOne({
      where: {
        user: { id: parseInt(userId) },
        book: { id: parseInt(bookId) },
        isReturned: false,
      },
      relations: ["user", "book"],
    });

    if (!lending) {
      return res.status(404).json({ message: "Active lending not found" });
    }

    // Update lending
    lending.isReturned = true;
    lending.returnDate = new Date();
    await lendingRepository.save(lending);

    // Save rating
    if (typeof score === "number") {
      const rating = new BookRating();
      rating.user = lending.user;
      rating.book = lending.book;
      rating.score = score;
      await ratingRepository.save(rating);
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Error returning book" });
  }
};
