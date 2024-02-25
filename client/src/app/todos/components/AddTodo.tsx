'use client';

import useAxiosAuth from '@/utils/useAxiosAuth';
import { queryClient } from '@/app/components/providers/ReactQueryClientProvider';
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';

export default function AddTodo() {
	const axiosAuth = useAxiosAuth();
	const { data } = useSession();
	const [todo, setTodo] = useState('');

	const { mutate, status: addTodoStatus } = useMutation({
		mutationKey: ['addTodo'],
		retry: 3,
		mutationFn: async (newTodo: { title: string; completed: boolean }) => {
			const response = await axiosAuth.post(`/user/${data?.user.id}/todo/createTodo`, newTodo);
			if (!response.data) throw new Error('Create todo failed');
			return await response.data;
		},
		onMutate: async (newTodo: any) => {
			await queryClient.cancelQueries(['todos']);
			const previousTodos = queryClient.getQueryData(['todos']);
			newTodo.id = String(Date.now());
			queryClient.setQueryData(['todos'], (old: any) => [newTodo, ...old]);
			return { previousTodos };
		},
		onError: (err: any, newTodo: any, context: any) => {
			queryClient.setQueryData(['todos'], context.previousTodo);
			alert('We got an error adding the todo. Try again latter.');
		},
		onSettled: () => {
			queryClient.invalidateQueries(['todos']);
		},
	});

	const addTodo = async (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		mutate({ title: todo, completed: false });
		setTodo('');
	};

	return (
		<section>
			<form onSubmit={addTodo}>
				<input
					type="text"
					id="todo"
					value={todo}
					onChange={(e) => setTodo(e.target.value)}
				/>
				<button
					type="submit"
					disabled={addTodoStatus === 'loading' || !todo}>
					Add new todo
				</button>
			</form>
		</section>
	);
}
