import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../../utils/response-api";
import { StatusCodes } from "http-status-codes";
import { signin } from "../../../services/mysql/auth";

const signIn = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const result = await signin(req);

        sendResponse(res, StatusCodes.CREATED, true, result, 'SignIn successfully')
    } catch (error) {
        next(error);
    }
}

export { signIn }