import { useCallback, useEffect, useState } from 'react'
import { getTodos } from '../../api/todos'
import type { Todo, TodoFilter, TodoInfo } from '../../types/todo'
import TodoHeader from '../../components/todo/TodoHeader/TodoHeader'
import TodoFilters from '../../components/todo/TodoFilters/TodoFilters'
import TodoList from '../../components/todo/TodoList/TodoList'
import styles from './styles.module.scss'
import clsx from 'clsx'

export default function TodoPage() {
	const [filter, setFilter] = useState<TodoFilter>('all')
	const [items, setItems] = useState<Todo[]>([])
	const [counts, setCounts] = useState<TodoInfo | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function load(filter: TodoFilter) {
		try {
			setLoading(true)
			setError(null)
			const resp = await getTodos(filter)
			setItems(resp.data)
			setCounts(resp.info ?? null)
		} catch (e: any) {
			setError(e?.message || 'Ошибка загрузки')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		load(filter)
	}, [filter])

	const refresh = useCallback(async () => {
		await load(filter)
	}, [filter])

	return (
		<section className={styles.todo}>
			<TodoHeader
				refresh={refresh}
			/>

			<TodoFilters
				active={filter}
				counts={counts}
				onChange={setFilter}
			/>

			{loading && <div className={styles.note}>Загрузка…</div>}

			{error && <div className={clsx(styles.note, styles.noteError)}>{error}</div>}

			{!loading && (
				<TodoList
					items={items}
					refresh={refresh}
				/>
			)}
		</section>
	)
}
