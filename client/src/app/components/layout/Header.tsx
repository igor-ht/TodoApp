'use client';

import styles from './layout.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Header() {
	const { status, data } = useSession();
	return (
		<header className={styles.header}>
			<div>
				<Image
					src="./icon.svg"
					alt="Logo"
					width={70}
					height={70}
				/>
				{data?.user?.name && <span>Hey there, {data.user.name}!</span>}
			</div>
			<nav>
				{status !== 'authenticated' ? (
					<>
						<Link href="/signin">Sign In</Link>
						<Link href="/signup">Sign Up</Link>
					</>
				) : (
					<>
						<Link
							className={styles.hasUser}
							href="/todos">
							Todos
						</Link>
						<Link
							className={styles.hasUser}
							href="/dashboard">
							Dashboard
						</Link>
					</>
				)}
			</nav>
		</header>
	);
}
