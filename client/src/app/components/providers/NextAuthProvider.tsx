'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

export default function NextAuthProvider({ session, children }: { session: never; children: React.ReactNode }) {
	return <SessionProvider session={session}>{children}</SessionProvider>;
}
