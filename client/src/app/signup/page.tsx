import styles from './page.module.scss';
import SignUp from './SignUp';

export default function Page() {
	return (
		<div className={styles.signup}>
			<SignUp />
		</div>
	);
}
