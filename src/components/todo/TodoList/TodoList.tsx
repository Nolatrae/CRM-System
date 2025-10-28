import { List, Empty } from 'antd'
import type { Todo } from '../../../types/todo'
import TodoRow from '../TodoRow/TodoRow'

type Props = {
	items: Todo[]
	onToggle: (id: number, isDone: boolean) => Promise<void>
	onDelete: (id: number) => Promise<void>
	onSaveTitle: (id: number, title: string) => Promise<void>
	onEditingChange: (id: number, editing: boolean) => void
}

export default function TodoList({ items, onToggle, onDelete, onSaveTitle, onEditingChange }: Props) {
	if (!items.length) {
		return <Empty description="Список пуст" />
	}
	return (
		<List
			dataSource={items}
			renderItem={(t) => (
				<List.Item>
					<TodoRow
						todo={t}
						onToggle={onToggle}
						onDelete={onDelete}
						onSaveTitle={onSaveTitle}
						onEditingChange={onEditingChange} />
				</List.Item>
			)}
		/>
	)
}
