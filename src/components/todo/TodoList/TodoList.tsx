import type { Todo } from '../../../types/todo'
import styles from './styles.module.scss'
import TodoRow from '../TodoRow/TodoRow'

type Props = {
	items: Todo[]
	onToggle: (id: number, isDone: boolean) => Promise<void>
	onDelete: (id: number) => Promise<void>
	onSaveTitle: (id: number, title: string) => Promise<void>
}

export default function TodoList({ items, onToggle, onDelete, onSaveTitle }: Props) {
	if (!items.length) {
		return <div className={styles.empty}>Список пуст</div>
	}
	return (
		<ul className={styles.list}>
			{items.map((t) => (
				<li key={t.id} className={styles.item}>
					<TodoRow
						todo={t}
						onToggle={onToggle}
						onDelete={onDelete}
						onSaveTitle={onSaveTitle}
					/>
				</li>
			))}
		</ul>
	)
}
