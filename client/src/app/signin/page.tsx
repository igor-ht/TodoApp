'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './page.module.scss';

type Inputs = {
	email: string;
	password: string;
};

export default function Page() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

	return (
		<div className={styles.signin}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<span>
					<label htmlFor="email">Email:</label>
					<input
						{...register('email', { required: true })}
						type="email"
						placeholder="email@example.com"
					/>
				</span>
				<span>
					<label htmlFor="password">Password:</label>
					<input
						{...register('password', { required: true })}
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
