import { NextFunction, Request, Response } from "express";

const authMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  };
};

export default authMiddleware;
