import { List, Empty } from 'antd'
import type { Todo } from '../../../types/todo'
import TodoRow from '../TodoRow/TodoRow'

type Props = {
	items: Todo[]
	onEditingChange: (id: number, editing: boolean) => void
	refresh: () => Promise<void>
}

export default function TodoList({ items, refresh, onEditingChange }: Props) {
	if (!items.length) {
		return <Empty description="Список пуст" />
	}

	return (
		<List
			dataSource={items}
			renderItem={(t: Todo) => (
				<List.Item>
					<TodoRow
						todo={t}
						onEditingChange={onEditingChange}
						refresh={refresh}
					/>
				</List.Item>
			)}
		/>
	)
}
