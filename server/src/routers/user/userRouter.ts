import express from 'express';
import todoRouter from './todo/todoRouter';
import { handleGetUserById, handleUserSignIn, handleUserSignUp } from './userRouterApi';

const userRouter = express.Router({ mergeParams: true, caseSensitive: true });

userRouter.post('/signin', handleUserSignIn);

userRouter.post('/signup', handleUserSignUp);

userRouter.get('/:id', handleGetUserById);

userRouter.use('/:id/todo', todoRouter);

export default userRouter;
