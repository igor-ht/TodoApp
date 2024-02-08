import express from 'express';
import { createTodo, deleteTodo, handleGetAllTodos, updateTodo } from './todoRouterApi';

const todoRouter = express.Router({ mergeParams: true, caseSensitive: true });

todoRouter.get('/allTodos', handleGetAllTodos);

todoRouter.post('/createTodo', createTodo);

todoRouter.put('/updateTodo', updateTodo);

todoRouter.delete('/deleteTodo', deleteTodo);

export default todoRouter;
