import 'module-alias/register';
import server from './server';
import { prisma, connectDataBase } from '@/model/client';
import { PORT } from './config';

const startServer = async () => {
	await connectDataBase();

	server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
};

startServer()
	.catch((error) => console.error(error))
	.finally(() => prisma.$disconnect());
