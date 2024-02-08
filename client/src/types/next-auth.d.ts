import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session {
		exp: string;
		user: User;
	}

	interface User {
		id: string;
		username: string;
		email: string;
		accessToken: string;
		refreshToken: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		username: string;
		email: string;
	}
}
