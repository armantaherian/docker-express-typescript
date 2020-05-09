import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // Get the jwt token from the head
  const token = <string>req.headers["auth"];
  let jwtPayload;

  if (!token) {
    return res.status(401).json({
      error: "provide a token!",
    });
  }

  // Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    // If token is not valid, respond with 401 (unauthorized)
    return res.status(401).json({
      error: "token expirated!",
    });
  }

  // Refresh token?
  // The token is valid for 1 hour
  // We want to send a new token on every request
  // const { userId, username } = jwtPayload;

  // const newToken = jwt.sign(
  //   {
  //     userId,
  //     username,
  //   },
  //   config.jwtSecret,
  //   {
  //     expiresIn: "1h",
  //   }
  // );

  // res.setHeader("token", newToken);

  // Call the next middleware or controller
  next();
};
