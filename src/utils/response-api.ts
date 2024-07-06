import { Response } from 'express';

interface ApiResponse {
  success: boolean;
  data?: any;
  message: string;
  code: number;
}

const sendResponse = (res: Response, statusCode: number, success: boolean, data: any, message: string) => {
  const response: ApiResponse = {
    success,
    data,
    message,
    code: statusCode,
  };

  return res.status(statusCode).json(response);
};

export {ApiResponse, sendResponse}