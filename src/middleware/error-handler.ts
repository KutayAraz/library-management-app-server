import { Request, Response } from "express";

export const errorHandler = (error: any, _: Request, res: Response) => {
  console.error(error.stack);

  if (error.name === "QueryFailedError") {
    return res.status(400).json({
      message: "Database operation failed",
      detail: error.message,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
    detail: error.message,
  });
};
