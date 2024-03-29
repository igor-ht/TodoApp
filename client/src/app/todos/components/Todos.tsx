'use client';

import Loading from '@/app/loading';
import useAxiosAuth from '@/utils/useAxiosAuth';
import { queryClient } from '@/app/components/providers/ReactQueryClientProvider';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation } from 'react-query';

export default function Todos() {
	const axiosAuth = useAxiosAuth();
	const { data, status } = useSession();

	const { data: allTodos, status: allTodosStatus } = useQuery({
		queryKey: ['todos'],
		enabled: !!data && status === 'authenticated',
		cacheTime: Infinity,
		staleTime: Infinity,
		retry: 1,
		queryFn: async () => {
			const response = await axiosAuth.get(`/user/${data?.user.id}/todo/allTodos`);
			if (!response.data) throw new Error('Network response was not ok');
			return await response.data;
		},
	});

	const { mutate: updateTodo, status: updatedTodoStatus } = useMutation({
		mutationKey: ['updateTodo'],
		retry: 3,
		mutationFn: async (updatedTodo: { todoId: string; title: string; completed: boolean }) => {
			const response = await axiosAuth.put(`/user/${data?.user.id}/todo/updateTodo`, updatedTodo);
			if (!response.data) throw new Error('Network response was not ok');
			return await response.data;
		},
		onMutate: async (updatedTodo: { todoId: string; title: string; completed: boolean }) => {
			queryClient.cancelQueries(['todos']);
			const previousTodos = queryClient.getQueryData(['todos']);
			queryClient.setQueryData(['todos'], (old: any) =>
				old?.map((todo: any) => ({
					...todo,
					completed: todo.id === updatedTodo.todoId ? updatedTodo.completed : todo.completed,
					isOnChange: todo.id === updatedTodo.todoId,
				}))
			);
			return { previousTodos };
		},
		onError: (err, updatedTodo, context) => {
			queryClient.setQueryData(['todos'], context?.previousTodos);
		},
		onSettled: () => {
			queryClient.invalidateQueries(['todos']);
		},
	});

	const { mutate: deleteTodo, status: deleteTodoStatus } = useMutation({
		mutationKey: ['deleteTodo'],
		retry: 3,
		mutationFn: async (deletedTodo: string) => {
			const response = await axiosAuth.delete(`/user/${data?.user.id}/todo/deleteTodo`, { data: { todoId: deletedTodo } });
			if (!response.data) throw new Error('Network response was not ok');
			return await response.data;
		},
		onMutate: async (deletedTodo: string) => {
			queryClient.cancelQueries(['todos']);
			const previousTodos = queryClient.getQueryData('todos');
			queryClient.setQueryData('todos', (old: any) => old?.filter((todo: any) => todo.id !== deletedTodo));
			return { previousTodos };
		},
		onError: (err: any, deletedTodo: any, context: any) => {
			queryClient.setQueryData(['todos'], context?.previousTodos);
		},
		onSettled: () => {
			queryClient.invalidateQueries(['todos']);
			queryClient.setQueryData(['todos'], (old: any) => [...old]);
		},
	});

	const { mutate: clearAllTodos, status: clearAllTodosStatus } = useMutation({
		mutationKey: ['clearAllTodos'],
		retry: 3,
		mutationFn: async () => {
			const res = await axiosAuth.delete(`/user/${data?.user.id}/todo/clearAllTodos`);
			return await res.data;
		},
		onMutate: () => {
			queryClient.cancelQueries(['todos']);
			queryClient.setQueryData(['todos'], []);
			return { todos: [] };
		},
		onError: (context: any) => {
			queryClient.setQueryData(['todos'], context?.previousTodos);
		},
		onSettled: () => {
			queryClient.invalidateQueries(['todos']);
			queryClient.setQueryData(['todos'], []);
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
		<>
			<section>
				<span>
					{(updatedTodoStatus === 'loading' || deleteTodoStatus === 'loading' || clearAllTodosStatus === 'loading') && <Loading />}
				</span>
				<button
					type="button"
					disabled={allTodos?.length === 0}
					onClick={() => clearAllTodos()}>
					Clear all todos
				</button>
			</section>

			<div>
				<ul>
					{allTodos?.map((todo: { id: string; title: string; completed: boolean; isOnChange?: boolean }) => (
						<li key={todo.id}>
							<span>
								<input
									type="checkbox"
									name="completed"
									id={todo.id}
									checked={todo.completed}
									disabled={updatedTodoStatus === 'loading' && todo.isOnChange}
									onChange={() => updateTodo({ todoId: todo.id, title: todo.title, completed: !todo.completed })}
								/>
								<p>{todo.title}</p>
							</span>
							<button
								type="button"
								onClick={() => deleteTodo(todo.id)}>
								Delete
							</button>
						</li>
					))}
				</ul>
			</div>
		</>
	);
}
