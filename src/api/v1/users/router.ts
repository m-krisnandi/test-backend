import { Router } from "express";
import { create, destroy, findAll, findOne, update } from "./controller";
import { validateUser } from '../../../utils/validators'

const router = Router();

router.post('/users', validateUser, create);
router.get('/users', findAll);
router.get('/users/:id', findOne);
router.put('/users/:id', validateUser, update)
router.delete('/users/:id', destroy)

export default router;