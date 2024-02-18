import { prisma } from '@/model/client';
import { Request, Response } from 'express';

export const handleGetAllTodos = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const allTodos = await prisma.todo.findMany({
			where: {
				userId: id,
			},
			select: {
				id: true,
				title: true,
				completed: true,
				userId: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return res.status(200).json(allTodos);
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};

export const createTodo = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { title } = req.body;

		const todo = await prisma.todo.create({
			data: {
				title,
				userId: id,
				createdAt: Date.now().toString(),
			},
			select: {
				id: true,
				title: true,
				completed: true,
				userId: true,
			},
		});

		return res.status(200).json(todo);
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};

export const updateTodo = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { todoId, title, completed } = req.body;

		const todo = await prisma.todo.update({
			where: {
				userId: id,
				id: todoId,
			},
			data: {
				title,
				completed,
			},
		});

		return res.status(200).json(todo);
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};

export const deleteTodo = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { todoId } = req.body;

		const todo = await prisma.todo.delete({
			where: {
				userId: id,
				id: todoId,
			},
		});

		return res.status(200).json(todo);
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};
