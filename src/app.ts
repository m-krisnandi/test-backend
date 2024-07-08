import express, { Application } from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import compression from 'compression'
import cors from 'cors'
import path from 'path';

import { 
    createCategoriesTable, createPostsTable, 
    createUserDetailTable, createUsersTable } from './tables'

import categoriesRouter from './api/v1/categories/router'
import usersRouter from './api/v1/users/router'
import authRouter from './api/v1/auth/router'
import postsRouter from './api/v1/posts/router'

import notFoundMiddleware from '../src/middlewares/not-found'
import errorHandlerMiddleware from '../src/middlewares/handle-error'

const app: Application = express();

app.use(cors({
    credentials: true,
}))
app.use(logger("dev"));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Create Table if does'n exists
createCategoriesTable();
createUsersTable();
createUserDetailTable();
createPostsTable();

// Router
const v1 = "/api/v1";

app.use(`${v1}`, categoriesRouter);
app.use(`${v1}`, usersRouter);
app.use(`${v1}`, authRouter);
app.use(`${v1}`, postsRouter);

// catch 404 and forward to error handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server running on http://localhost:8080/')
})