'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaSignup } from '@/utils/validation';
import { ENDPOINT } from '@/config';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useAxiosAuth from '@/utils/useAxiosAuth';

type Inputs = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};
export default function SignUp() {
	const router = useRouter();
	const axiosAuth = useAxiosAuth();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, dirtyFields },
		setError,
	} = useForm<Inputs>({
		defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
		resolver: yupResolver(schemaSignup),
	});

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		const response = await axiosAuth.post('/user/signup', data);

		if (response.status === 409) return setError('username', { message: 'Username already exists' });
		if (response.status === 422) return setError('email', { message: 'Email already exists' });

		if (!response.data) return setError('username', { message: 'Something went wrong' });

		const res = await signIn('credentials', { email: data.email, password: data.password, redirect: false });
		if (!res?.ok) return setError('email', { message: 'The account was created but could not sign in.' });
		return router.push('/todos');
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<section>
				<span>
					<label htmlFor="username">Username:</label>
					{dirtyFields.username && errors.username && <p>{errors.username.message}</p>}
				</span>
				<input
					{...register('username', { required: true })}
					type="text"
					id="username"
					placeholder="Username"
					autoComplete="username"
				/>
			</section>
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
					{dirtyFields.password && errors.password && <p>{errors.password.message}</p>}
				</span>
				<input
					{...register('password', { required: true })}
					type="password"
					id="password"
					placeholder="Password"
				/>
			</section>
			<section>
				<span>
					<label htmlFor="confirmPassword">Confirm Password:</label>
					{dirtyFields.confirmPassword && errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
				</span>
				<input
					{...register('confirmPassword', { required: true })}
					type="password"
					id="confirmPassword"
					placeholder="Confirm Password"
				/>
			</section>
			<button
				disabled={isSubmitting || !dirtyFields.username || !dirtyFields.email || !dirtyFields.password || !dirtyFields.confirmPassword}
				type="submit">
				Sign up
			</button>
		</form>
	);
}
