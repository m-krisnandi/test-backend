import { Router } from "express";
import { create, destroy, findAll, findOne, update } from "./controller";
import { validateUser } from '../../../utils/validators'
import { authenticateUser } from "../../../middlewares/auth";

const router = Router();

router.post('/users', validateUser, authenticateUser, create);
router.get('/users', authenticateUser, findAll);
router.get('/users/:id', authenticateUser, findOne);
router.put('/users/:id', validateUser, authenticateUser, update)
router.delete('/users/:id', authenticateUser, destroy)

export default router;