import styles from './page.module.scss';
import SignIn from './SIgnIn';

export default function Page() {
	return (
		<div className={styles.signin}>
			<SignIn />
		</div>
	);
}
