import { prisma } from './client';

const seed = async () => {
	const hasUser = await prisma.user.findFirst({});
	if (hasUser) return;
	await prisma.user.create({
		data: {
			email: 'test@test.com',
			password: 'test',
			username: 'test',
			todos: {
				create: [
					{
						title: 'Buy groceries',
						completed: true,
						createdAt: Date.now().toString(),
					},
					{
						title: 'Walk the dog',
						createdAt: Date.now().toString(),
					},
					{
						title: 'Wash the car',
						createdAt: Date.now().toString(),
					},
				],
			},
		},
	});
};

export default seed;
