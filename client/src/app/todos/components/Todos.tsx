'use client';

import { queryClient } from '@/app/components/providers/ReactQueryClientProvider';
import Loading from '@/app/loading';
import { ENDPOINT } from '@/config';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useQuery, useMutation } from 'react-query';

export default function Todos() {
	const { data, status } = useSession();

	const { data: allTodos, status: allTodosStatus } = useQuery({
		queryKey: ['todos'],
		enabled: !!data && status === 'authenticated',
		cacheTime: Infinity,
		staleTime: Infinity,
		retry: 1,
		queryFn: async () => {
			const response = await fetch(`${ENDPOINT}/user/${data?.user.id}/todo/allTodos`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		},
	});

	const { mutate: updateTodo, status: updatedTodoStatus } = useMutation({
		mutationKey: ['updateTodo'],
		retry: 3,
		mutationFn: async (updatedTodo: { todoId: string; title: string; completed: boolean }) => {
			const response = await fetch(`${ENDPOINT}/user/${data?.user.id}/todo/updateTodo`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedTodo),
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		},
		onMutate: (updatedTodo: { todoId: string; title: string; completed: boolean }) => {
			queryClient.cancelQueries('todos');
			const previousTodos = queryClient.getQueryData('todos');
			queryClient.setQueryData('todos', (old: any) => {
				const index = old.findIndex((todo: any) => todo === updatedTodo);
				old[index] = updatedTodo;
				return old;
			});
			return { previousTodos };
		},
		onError: (err, updatedTodo, context) => {
			queryClient.setQueryData('todos', context?.previousTodos);
		},
		onSettled: () => {
			queryClient.invalidateQueries('todos');
		},
	});

	const { mutate: deleteTodo, status: deleteTodoStatus } = useMutation({
		mutationKey: ['deleteTodo'],
		retry: 3,
		mutationFn: async (deletedTodo: string) => {
			const response = await fetch(`${ENDPOINT}/user/${data?.user.id}/todo/deleteTodo`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ todoId: deletedTodo }),
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		},
		onMutate: (deletedTodo: string) => {
			queryClient.cancelQueries('todos');
			const previousTodos = queryClient.getQueryData('todos');
			queryClient.setQueryData('todos', (old: any) => old?.filter((todo: string) => todo !== deletedTodo));
			return { previousTodos };
		},
		onError: (err: any, deletedTodo: any, context: any) => {
			queryClient.setQueryData('todos', context?.previousTodos);
		},
		onSettled: () => {
			queryClient.invalidateQueries('todos');
		},
	});

	if (allTodosStatus === 'loading') return <Loading />;

	if (allTodosStatus === 'error')
		return (
			<div
				className="error"
				style={{ justifyContent: 'flex-start' }}>
				Something went wrong!
			</div>
		);

	return (
		<div>
			<ul>
				{allTodos?.reverse().map((todo: { id: string; title: string; completed: boolean }) => (
					<li key={todo.id || Date.now()}>
						<span>
							<input
								type="checkbox"
								name="completed"
								id="completed"
								checked={todo.completed}
								onChange={() => updateTodo({ todoId: todo.id, title: todo.title, completed: !todo.completed })}
							/>
							<p>{todo.title}</p>
						</span>
						<button
							type="button"
							disabled={updatedTodoStatus === 'loading' || deleteTodoStatus === 'loading'}
							onClick={() => deleteTodo(todo.id)}>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
