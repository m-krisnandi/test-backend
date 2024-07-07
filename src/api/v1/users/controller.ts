import { Request, Response, NextFunction } from 'express'
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../../../services/mysql/users';
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

        const result = await createUser(req);
        sendResponse(res, StatusCodes.CREATED, true, result, 'User created successfully')
    } catch (error) {
        next(error)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getAllUsers();
        sendResponse(res, StatusCodes.OK, true, result, 'Get All Users')
    } catch (error) {
        next(error)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getUserById(req);
        sendResponse(res, StatusCodes.CREATED, true, result, 'Get User By Id')
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

        const result = await updateUser(req);
        sendResponse(res, StatusCodes.CREATED, true, result, 'User updated successfully')
    } catch (error) {
        next(error)
    }
}

const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteUser(req);
        sendResponse(res, StatusCodes.CREATED, true, {}, 'User deleted successfully')
    } catch (error) {
        next(error)
    }
}

export { create, findAll, findOne, update, destroy }