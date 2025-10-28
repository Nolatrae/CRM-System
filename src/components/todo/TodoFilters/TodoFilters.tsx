import { Badge, Tabs } from 'antd'
import type { TodoFilter, TodoInfo } from '../../../types/todo'

type Props = {
	active: TodoFilter
	counts: TodoInfo | null
	onChange: (f: TodoFilter) => void
}

export default function TodoFilters({ active, counts, onChange }: Props) {
	const c = counts ?? { all: 0, inWork: 0, completed: 0 }

	const items = [
		{ key: 'all', label: <>Все <Badge count={c.all} showZero /></> },
		{ key: 'inWork', label: <>В работе <Badge count={c.inWork} showZero /></> },
		{ key: 'completed', label: <>Сделано <Badge count={c.completed} showZero /></> },
	]

	return (
		<Tabs
			activeKey={active}
			items={items}
			onChange={(k) => onChange(k as TodoFilter)}
			style={{ marginBottom: 16 }}
		/>
	)
}
