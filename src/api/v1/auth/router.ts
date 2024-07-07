import { Router } from "express";
import { signIn } from "./controller";

const router = Router();

router.post('/auth/signin', signIn);

export default router;