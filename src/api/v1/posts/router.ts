import { Router } from "express";
import { create, destroy, findAll, findOne, update } from "./controller";
import { validatePost } from '../../../utils/validators'
import { authenticateUser } from "../../../middlewares/auth";
import upload from "../../../middlewares/upload";

const router = Router();

router.post('/posts', authenticateUser, upload.single('image_url'), validatePost, create);
router.get('/posts', authenticateUser, findAll);
router.get('/posts/:id', authenticateUser, findOne);
router.put('/posts/:id', authenticateUser, upload.single('image_url'), validatePost, update)
router.delete('/posts/:id', authenticateUser, destroy)

export default router;