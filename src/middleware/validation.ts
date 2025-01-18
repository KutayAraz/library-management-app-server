import { Request, Response, NextFunction } from "express";

export const validateBookReturn = (req: Request, res: Response, next: NextFunction) => {
  const { score } = req.body;

  if (score !== undefined && (score < 0 || score > 10)) {
    return res.status(400).json({
      message: "Score must be between 0 and 10",
    });
  }

  return next();
};
