import express from 'express';
import cors from 'cors';
import userRouter from './routers/user/userRouter';

const server = express();

server.use(cors({ origin: '*' }));

server.use(express.json());

server.use(express.urlencoded({ extended: false }));

server.use('/user', userRouter);

export default server;
