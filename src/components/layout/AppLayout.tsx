import { Layout, Menu } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'

const { Sider, Content } = Layout

export default function AppLayout() {
	const { pathname } = useLocation()

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider>
				<div style={{ color: '#fff', padding: 16, fontWeight: 600 }}>CRM System</div>
				<Menu
					theme="dark"
					mode="inline"
					selectedKeys={[pathname]}
					items={[
						{ key: '/', label: <Link to="/">Список задач</Link> },
						{ key: '/profile', label: <Link to="/profile">Профиль</Link> },
					]}
				/>
			</Sider>
			<Layout>
				<Content style={{ padding: 16 }}>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	)
}
