'use client';

import { useSession } from 'next-auth/react';

export default function UserInfo() {
	const { data } = useSession();

	if (!data) return <></>;

	return (
		<div>
			<span>
				<p>Username:</p>
				<p>{data.user.username}</p>
			</span>
			<span>
				<p>Email:</p>
				<p>{data.user.email}</p>
			</span>
		</div>
	);
}
