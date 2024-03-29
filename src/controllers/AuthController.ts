import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import jwt from "jsonwebtoken";
import { User } from '../models/entity/User';
import config from "../config/config";

/**
 * [AuthController description]
 * I just copied all this codes from:
 * https://github.com/andregardi/jwt-express-typeorm/blob/master/src/controllers/AuthController.ts
 */
class AuthController {
  static login = async (req: Request, res: Response) => {
    // Check if username and password are set
    let { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).json({
        error: 'provide username and password!'
      });
    }

    // Get user from database
    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      return res.status(401).json({
        error: 'username is wrong!'
      });
    }

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).json({
        error: 'username or password is wrong!'
      });
      return;
    }

    // Sing JWT, valid for 1 hour
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      config.jwtSecret,
      {
        expiresIn: "1h",
      },
    );

    // Send the jwt in the response
    res.json({
      token: token,
    });
  };

  static changePassword = async (req: Request, res: Response) => {
    // Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    // Get parameters from the body
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    // Get user from the database
    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    // Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    // Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);

    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}

export default AuthController;
