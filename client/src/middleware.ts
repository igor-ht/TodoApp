import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
	const token = await getToken({ req });
	const isAuthenticated = !!token;
	const currentPath = req.nextUrl.pathname;

	if (currentPath.startsWith('/signin') || currentPath.startsWith('/signup')) {
		if (isAuthenticated) return NextResponse.redirect(new URL('/todos', req.url));
	}

	if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/todos')) {
		if (!isAuthenticated) return NextResponse.redirect(new URL('/signin', req.url));
	}

	return NextResponse.next();
}

export const config = { matcher: ['/dashboard', '/todos', '/signin', '/signup'] };
