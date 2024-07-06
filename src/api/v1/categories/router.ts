import { Router } from "express";
import { create, destroy, findAll, findOne, update } from "./controller";
import { validateCategory } from '../../../utils/validators'

const router = Router();

router.post('/categories', validateCategory, create);
router.get('/categories', findAll);
router.get('/categories/:id', findOne);
router.put('/categories/:id', update)
router.delete('/categories/:id', destroy)

export default router;