import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Book } from "../entities/Book";

/**
 * Retrieves all books from the database
 * Returns a sorted list of books with basic information (id, name)
 */
export const getBooks = async (_: Request, res: Response) => {
  try {
    const bookRepository = AppDataSource.getRepository(Book);
    // Fetch books with minimal fields, sorted alphabetically
    const books = await bookRepository.find({
      select: ["id", "name"],
      order: { name: "ASC" },
    });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
};

/**
 * Retrieves detailed information about a specific book
 * Includes the current borrower and average rating
 */
export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookRepository = AppDataSource.getRepository(Book);

    const book = await bookRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["ratings", "lendings", "lendings.user"],
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find current lending if exists
    const currentLending = book.lendings.find(lending => !lending.isReturned);
    const currentOwner = currentLending ? currentLending.user.name : null;

    // Calculate average score
    let score = -1;
    if (book.ratings.length > 0) {
      const sum = book.ratings.reduce((acc, rating) => acc + rating.score, 0);
      score = parseFloat((sum / book.ratings.length).toFixed(2));
    }

    return res.json({
      id: book.id,
      name: book.name,
      author: book.author,
      year: book.year,
      currentOwner: currentOwner,
      score: score,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book" });
  }
};
