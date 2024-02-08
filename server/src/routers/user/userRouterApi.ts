import { prisma } from '@/model/client';
import { Request, Response } from 'express';
import { comparePassword, handleHashing } from '@/utils/hashing';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/src/config';

export const handleGetUserById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const user = await prisma.user.findFirst({
			where: {
				id: id,
			},
			select: {
				id: true,
				username: true,
				email: true,
			},
		});

		if (!user) return res.status(404).json({ message: 'User not found.' });

		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};

export const handleUserSignIn = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await prisma.user.findFirst({
			where: {
				email,
			},
			select: {
				id: true,
				username: true,
				email: true,
				password: true,
			},
		});
		if (!user) return res.status(404).json({ message: 'One or more fields is not valid.' });

		const compare = await comparePassword(password, user.password);
		if (!compare) return res.status(404).json({ message: 'One or more fields is not valid.' });

		const accessToken = await generateAccessToken({ id: user.id, username: user.username, email: user.email }, ACCESS_TOKEN_KEY);
		const refreshToken = await generateRefreshToken({ id: user.id, username: user.username, email: user.email }, REFRESH_TOKEN_KEY);
		const updatedUser = await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				accessToken,
				refreshToken,
			},
			select: {
				id: true,
				username: true,
				email: true,
				accessToken: true,
				refreshToken: true,
			},
		});

		if (!updatedUser) throw new Error('Login failed.');
		return res.status(200).json(updatedUser);
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};

export const handleUserSignUp = async (req: Request, res: Response) => {
	try {
		const { username, email, password } = req.body;

		const hasUser = await prisma.user.findFirst({
			where: {
				OR: [
					{
						username,
					},
					{
						email,
					},
				],
			},
			select: {
				username: true,
				email: true,
			},
		});
		if (hasUser && hasUser.username === username) return res.status(409).json({ message: 'Username already exists.' });
		if (hasUser && hasUser.email === email) return res.status(422).json({ message: 'Email already exists.' });

		const hashedPassword = await handleHashing(password);
		const user = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
			select: {
				id: true,
				username: true,
				email: true,
			},
		});
		if (!user) return res.status(400).json({ message: 'User could not be created.' });

		return res.status(200).json({ message: 'User created.' });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};
