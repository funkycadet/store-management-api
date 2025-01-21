import { UserController } from "../controllers";
import { Router } from "express";
import { validateJWT, checkRole, validateParams } from "../middlewares";
import { idSchema } from "../validations";

const userController = new UserController();
const userRouter = Router();

userRouter.use(validateJWT());

userRouter.get("/", checkRole(["admin", "superadmin"]), userController.getAll);
userRouter.get("/me", userController.getUserById);
userRouter.get("/:id", checkRole(["admin", "superadmin"]), validateParams(idSchema), userController.getUser);
userRouter.patch("/:id", userController.updateUser);
userRouter.delete("/:id", checkRole(["superadmin"]), userController.deleteUser);

export default userRouter;
