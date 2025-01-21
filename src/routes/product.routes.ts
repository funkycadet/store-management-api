import { Router } from "express";
import { ProductController } from "../controllers";
import { validateJWT, checkRole, validateParams, validateReqBody } from "../middlewares";
import { idSchema, createProductSchema } from "../validations";

const productController = new ProductController();
const productRouter = Router();

productRouter.use(validateJWT());

productRouter.get("/", productController.getAll);
productRouter.get("/:id", validateParams(idSchema), productController.getProductById);
productRouter.post("/", checkRole(["admin", "superadmin"]), validateReqBody(createProductSchema), productController.createProduct);
productRouter.patch("/:id", checkRole(["admin", "superadmin"]), productController.updateProduct);
productRouter.delete("/:id", checkRole(["superadmin"]), productController.deleteProduct);

export default productRouter;

