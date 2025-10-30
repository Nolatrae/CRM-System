import type { Todo } from '../../../types/todo'
import styles from './styles.module.scss'
import TodoRow from '../TodoRow/TodoRow'

type Props = {
	items: Todo[]
	refresh: () => Promise<void>
}

export default function TodoList({ items, refresh }: Props) {
	if (!items.length) {
		return <div className={styles.empty}>Список пуст</div>
	}
	return (
		<ul className={styles.list}>
			{items.map((t) => (
				<li key={t.id} className={styles.item}>
					<TodoRow
						todo={t}
						refresh={refresh}
					/>
				</li>
			))}
		</ul>
	)
}
