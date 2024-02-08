import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const NextAuthOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Sign in',
			credentials: {
				id: { label: 'ID', type: 'text' },
				username: { label: 'Username', type: 'text' },
				email: { label: 'Email', type: 'email' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.id || !credentials?.username) return null;

				return { ...credentials };
			},
		}),
	],
	callbacks: {
		jwt: async ({ token, user }) => {
			if (!user) return token;
			return { ...user };
		},
		session: async ({ session, token }) => {
			return {
				expires: session.expires,
				user: {
					id: token.id,
					username: token.username,
					email: token.email,
					role: token.role,
				},
			};
		},
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60,
	},
	jwt: {
		maxAge: 30 * 24 * 60 * 60,
	},
	pages: {
		signIn: '/signin',
		newUser: '/signup',
		error: '/signup',
	},
};
