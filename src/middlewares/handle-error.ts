import {Request, Response, NextFunction} from 'express'
import { StatusCodes } from 'http-status-codes';

interface CustomError extends Error {
    success?: boolean;
    statusCode?: number;
    code?: number;
    errors?: {message: string}[];
    value?: string;
}

const errorHandlerMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    let customError = {
        success: false,
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong'
    };

    // Error duplicate key
    if (err.code && err.code === 1062) {
        customError.success = false;
        customError.message = 'Duplicate field value entered, please use another value';
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    return res.status(customError.statusCode).json({
        success: customError.success,
        message: customError.message,
        code: customError.statusCode
    });
};

export default errorHandlerMiddleware;