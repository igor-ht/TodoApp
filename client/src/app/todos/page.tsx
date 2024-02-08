import styles from './page.module.scss';
import AddTodo from './components/AddTodo';
import Todos from './components/Todos';

export default function Page() {
	return (
		<div className={styles.todosContainer}>
			<AddTodo />
			<Todos />
		</div>
	);
}
