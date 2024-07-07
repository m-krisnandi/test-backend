import { Router } from "express";
import { create, destroy, findAll, findOne, update } from "./controller";
import { validateCategory } from '../../../utils/validators'
import { authenticateUser } from "../../../middlewares/auth";

const router = Router();

router.post('/categories', validateCategory, authenticateUser, create);
router.get('/categories', authenticateUser, findAll);
router.get('/categories/:id', authenticateUser, findOne);
router.put('/categories/:id', validateCategory, authenticateUser, update)
router.delete('/categories/:id', authenticateUser, destroy)

export default router;