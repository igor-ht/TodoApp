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
					},
					{
						title: 'Walk the dog',
					},
					{
						title: 'Wash the car',
					},
				],
			},
		},
	});
};

export default seed;
