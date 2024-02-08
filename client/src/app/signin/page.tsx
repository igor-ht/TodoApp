'use client';

import styles from './page.module.scss';

export default function Page() {
	return (
		<div className={styles.signin}>
			<form action="">
				<span>
					<label htmlFor="email">Email:</label>
					<input
						id="email"
						name="email"
						type="email"
						placeholder="email@example.com"
					/>
				</span>
				<span>
					<label htmlFor="password">Password:</label>
					<input
						id="password"
						name="password"
						type="password"
						placeholder="Password"
					/>
				</span>
				<button
					// disabled
					type="submit">
					Sign in
				</button>
			</form>
		</div>
	);
}
