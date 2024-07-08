import { Request, Response, NextFunction } from 'express'
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from '../../../services/mysql/posts';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../../../utils/response-api';
import { validationResult } from 'express-validator';

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // apply validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }

        const result = await createPost(req);
        sendResponse(res, StatusCodes.CREATED, true, result, 'Post created successfully')
    } catch (error) {
        next(error)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getAllPosts();
        sendResponse(res, StatusCodes.OK, true, result, 'Get All Posts')
    } catch (error) {
        next(error)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getPostById(req);
        sendResponse(res, StatusCodes.OK, true, result, 'Get Post By Id')
    } catch (error) {
        next(error)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // apply validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }

        const result = await updatePost(req);
        sendResponse(res, StatusCodes.OK, true, result, 'Post updated successfully')
    } catch (error) {
        next(error)
    }
}

const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deletePost(req);
        sendResponse(res, StatusCodes.OK, true, {}, 'Post deleted successfully')
    } catch (error) {
        next(error)
    }
}

export { create, findAll, findOne, update, destroy }