import NextAuth from 'next-auth';
import { NextAuthOptions } from './nextAuth';

const handler = NextAuth(NextAuthOptions);

export { handler as GET, handler as POST };
