'use client';

import { queryClient } from '@/app/components/providers/ReactQueryClientProvider';
import { ENDPOINT } from '@/config';
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';

export default function AddTodo() {
	const { data } = useSession();
	const [todo, setTodo] = useState('');

	const { mutate, status: addTodoStatus } = useMutation({
		mutationKey: ['addTodo'],
		retry: 3,
		mutationFn: async (newTodo: { title: string; completed: boolean }) => {
			const response = await fetch(`${ENDPOINT}/user/${data?.user.id}/todo/createTodo`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newTodo),
			});
			if (!response.ok) throw new Error('Create todo failed');
			return response.json();
		},
		onMutate: (newTodo: { title: string; completed: boolean }) => {
			queryClient.cancelQueries('todos');
			const previousTodos = queryClient.getQueryData('todos');
			queryClient.setQueryData('todos', (old: any) => [...old, newTodo]);
			return { previousTodos };
		},
		onError: (err: any, newTodo: any, context: any) => {
			queryClient.setQueryData('todos', context?.previousTodos);
		},
		onSettled: () => {
			queryClient.invalidateQueries('todos');
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
