import { Router } from "express";
import { loginUser, signUpUser } from "../controllers/user.controller";
import { validate, ValidationSource } from "../middlewares/validate.middleware";
import { loginSchema, signUpSchema } from "../schema/user.schema";
const router = Router();

router.route("/signup").post(validate(signUpSchema, ValidationSource.BODY), signUpUser);
router.route("/login").post(validate(loginSchema, ValidationSource.BODY), loginUser);

export default router;
