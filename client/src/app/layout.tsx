import './globals.scss';
import NextAuthProvider from './components/providers/NextAuthProvider';
import ReactQueryClientProvider from './components/providers/ReactQueryClientProvider';
import Header from './components/layout/Header';
import Main from './components/layout/Main';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Todo App',
	description: 'Generated by create next app',
	icons: { icon: 'icon.svg' },
};

export default function RootLayout({ children, session }: { children: React.ReactNode; session: never }) {
	return (
		<html lang="en">
			<body>
				<NextAuthProvider session={session}>
					<ReactQueryClientProvider>
						<Header />
						<Main>{children}</Main>
					</ReactQueryClientProvider>
				</NextAuthProvider>
				<Analytics />
			</body>
		</html>
	);
}
