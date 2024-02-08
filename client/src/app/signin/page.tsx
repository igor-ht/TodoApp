'use client';

import styles from './page.module.scss';
import { useForm, SubmitHandler } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaSignin } from '@/utils/validation';

type Inputs = {
	email: string;
	password: string;
};

export default function Page() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting, dirtyFields },
	} = useForm<Inputs>({ defaultValues: { email: '', password: '' }, resolver: yupResolver(schemaSignin) });

	const onSubmit: SubmitHandler<Inputs> = (data) => signIn('credentials', data);

	return (
		<div className={styles.signin}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<section>
					<span>
						<label htmlFor="email">Email:</label>
					</span>

					<input
						{...register('email', { required: true })}
						type="email"
						placeholder="email@example.com"
					/>
				</section>
				<section>
					<span>
						<label htmlFor="password">Password:</label>
					</span>
					<input
						{...register('password', { required: true })}
						type="password"
						placeholder="Password"
					/>
				</section>
				<button
					disabled={isSubmitting || !dirtyFields.email || !dirtyFields.password}
					type="submit">
					Sign in
				</button>
			</form>
		</div>
	);
}
