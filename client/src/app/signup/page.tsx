'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './page.module.scss';

type Inputs = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
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
		<div className={styles.signup}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<span>
					<label htmlFor="username">Username:</label>
					<input
						{...register('username', { required: true })}
						type="text"
						placeholder="Username"
					/>
				</span>
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
				<span>
					<label htmlFor="confirmPassword">Confirm Password:</label>
					<input
						{...register('confirmPassword', { required: true })}
						type="password"
						placeholder="Confirm Password"
					/>
				</span>
				<button type="submit">Sign up</button>
			</form>
		</div>
	);
}
