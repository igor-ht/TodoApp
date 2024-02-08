import UserInfo from './components/UserInfo';
import styles from './page.module.scss';

export default function Page() {
	return (
		<div className={styles.dashboard}>
			<UserInfo />
		</div>
	);
}
