import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

// Get all users
router.get("/", [checkJwt, checkRole(["100"])], UserController.listAll);

// Get one user
router.get( "/:id([0-9]+)", [checkJwt, checkRole(["100"])], UserController.getOneById);

// Create a new user
router.post("/", [checkJwt, checkRole(["100"])], UserController.newUser);

// Edit one user
router.patch("/:id([0-9]+)", [checkJwt, checkRole(["100"])], UserController.editUser);

// Delete one user
router.delete( "/:id([0-9]+)", [checkJwt, checkRole(["100"])], UserController.deleteUser);

export default router;
