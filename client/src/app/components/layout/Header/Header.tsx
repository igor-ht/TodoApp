import Link from 'next/link';

export default function Header() {
	return (
		<header>
			<div>MY TODO APP</div>
			<nav>
				<Link href="/signin">Sign In</Link>
				<Link href="/signup">Sign Up</Link>
				<Link href="/todos">Todos</Link>
				<Link href="/dashboard">Dashboard</Link>
			</nav>
		</header>
	);
}
