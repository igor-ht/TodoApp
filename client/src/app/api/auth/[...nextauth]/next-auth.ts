import { ENDPOINT } from '@/config';
import axios from 'axios';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const NextAuthOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Sign in',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const response = await axios.post(`${ENDPOINT}/user/signin`, credentials);
				if (!response.data || response.status !== 200) return null;

				const user = await response.data;
				return user;
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
					accessToken: token.accessToken,
					refreshtoken: token.refreshToken,
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
