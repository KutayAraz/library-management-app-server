import { Router } from "express";
import { getUsers, getUserById, borrowBook, returnBook } from "../controllers/user.controller";
import { validateBookReturn } from "@/middleware/validation";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/:userId/borrow/:bookId", borrowBook);
router.post("/:userId/return/:bookId", validateBookReturn, returnBook);

export default router;
