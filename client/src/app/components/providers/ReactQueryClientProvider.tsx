'use client';

import { QueryClient, QueryClientProvider } from 'react-query';

export const queryClient = new QueryClient({});

export default function ReactQueryClientProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
