import { Link, Outlet } from "react-router-dom"

export default function AppLayout() {
	return (
		<div className="app">
			<header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
				<nav style={{ display: "flex", gap: 12 }}>
					<Link to="/">Главная</Link>
				</nav>
			</header>
			<main style={{ padding: 16 }}>
				<Outlet />
			</main>
		</div>
	)
}