import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api-error";

class UnauthenticatedError extends CustomAPIError {
    constructor(message: string) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

export default UnauthenticatedError;