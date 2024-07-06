import { Request, Response, NextFunction } from 'express'
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../../../services/mysql/categories';
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

        const result = await createCategory(req);
        sendResponse(res, StatusCodes.CREATED, true, result, 'Category created successfully')
    } catch (error) {
        next(error)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getAllCategories();
        sendResponse(res, StatusCodes.OK, true, result, 'Get All Categories')
    } catch (error) {
        next(error)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getCategoryById(req);
        sendResponse(res, StatusCodes.CREATED, true, result, 'Get Category By Id')
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

        const result = await updateCategory(req);
        sendResponse(res, StatusCodes.CREATED, true, result, 'Category updated successfully')
    } catch (error) {
        next(error)
    }
}

const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteCategory(req);
        sendResponse(res, StatusCodes.CREATED, true, {}, 'Category deleted successfully')
    } catch (error) {
        next(error)
    }
}

export { create, findAll, findOne, update, destroy }