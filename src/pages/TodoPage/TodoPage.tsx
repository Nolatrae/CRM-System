import { useEffect, useState } from 'react'
import { createTodo, deleteTodo, getTodos, updateTodo } from '../../api/todos'
import type { Todo, TodoFilter, TodoInfo } from '../../types/todo'
import TodoHeader from '../../components/todo/TodoHeader/TodoHeader'
import TodoFilters from '../../components/todo/TodoFilters/TodoFilters'
import TodoList from '../../components/todo/TodoList/TodoList'
import styles from './styles.module.scss'

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
			setError(e.message || 'Ошибка загрузки')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		load(filter)
	}, [filter])

	const handleAdd = async (title: string) => {
		await createTodo({ title })
		await load(filter)
	}

	const handleToggle = async (id: number, isDone: boolean) => {
		await updateTodo(id, { isDone })
		await load(filter)
	}

	const handleDelete = async (id: number) => {
		await deleteTodo(id)
		await load(filter)
	}

	const handleSaveTitle = async (id: number, title: string) => {
		await updateTodo(id, { title })
		await load(filter)
	}

	return (
		<section className={styles.todo}>
			<TodoHeader
				onAdd={handleAdd}
			/>

			<TodoFilters
				active={filter}
				counts={counts}
				onChange={setFilter}
			/>

			{loading && <div className={styles.note}>Загрузка…</div>}
			{error && <div className={`${styles.note} ${styles.noteError}`}>{error}</div>}

			{!loading && !error && (
				<TodoList
					items={items}
					onToggle={handleToggle}
					onDelete={handleDelete}
					onSaveTitle={handleSaveTitle}
				/>
			)}
		</section>
	)
}
