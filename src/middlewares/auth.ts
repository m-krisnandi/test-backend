import { isTokenValid, Payload } from "../utils";
import { UnauthenticatedError } from "../errors";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
    user?: Payload
}

const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        let token;
        // check head
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
        }

        if(!token) {
            throw new UnauthenticatedError("Token not define")
        }

        const payload = isTokenValid(token) as Payload;

        // set user
        req.user = {
            userId: payload.userId,
            name: payload.name,
            email: payload.email
        }

        next();
    } catch (error) {
        next(error);
    }
}

export { authenticateUser }