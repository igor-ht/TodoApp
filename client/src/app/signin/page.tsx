'use client';

import styles from './page.module.scss';
import { useForm, SubmitHandler } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaSignin } from '@/utils/validation';
import { useRouter } from 'next/navigation';

type Inputs = {
	email: string;
	password: string;
};

export default function Page() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, dirtyFields },
		setError,
	} = useForm<Inputs>({ defaultValues: { email: '', password: '' }, resolver: yupResolver(schemaSignin) });

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		const res = await signIn('credentials', { email: data.email, password: data.password, redirect: false });
		if (!res?.ok) return setError('email', { message: 'Invalid email or password' });
		return router.push('/todos');
	};

	return (
		<div className={styles.signin}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<section>
					<span>
						<label htmlFor="email">Email:</label>
						{dirtyFields.email && errors.email && <p>{errors.email.message}</p>}
					</span>
					<input
						{...register('email', { required: true })}
						type="email"
						id="email"
						placeholder="email@example.com"
						autoComplete="email"
					/>
				</section>
				<section>
					<span>
						<label htmlFor="password">Password:</label>
					</span>
					<input
						{...register('password', { required: true })}
						id="password"
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
