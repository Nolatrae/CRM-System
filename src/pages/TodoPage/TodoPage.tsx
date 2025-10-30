import { useCallback, useEffect, useState } from 'react'
import type { Todo, TodoFilter, TodoInfo } from '../../types/todo'
import TodoHeader from '../../components/todo/TodoHeader/TodoHeader'
import TodoFilters from '../../components/todo/TodoFilters/TodoFilters'
import TodoList from '../../components/todo/TodoList/TodoList'
import styles from './styles.module.scss'
import { Alert, Spin } from 'antd'
import { getTodos } from '@api/todos'

const REFRESH_INTERVAL_MS = 5_000

export default function TodoPage() {
	const [filter, setFilter] = useState<TodoFilter>('all')
	const [items, setItems] = useState<Todo[]>([])
	const [counts, setCounts] = useState<TodoInfo | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [editingIds, setEditingIds] = useState<Set<number>>(new Set())

	const load = useCallback(async (filter: TodoFilter) => {
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
	}, [])


	useEffect(() => {
		load(filter)
	}, [filter, load])

	useEffect(() => {
		if (editingIds.size > 0) {
			return
		}
		const id = setInterval(() => load(filter), REFRESH_INTERVAL_MS)
		return () => clearInterval(id)
	}, [filter, load, editingIds])

	const handleEditingChange = useCallback((id: number, editing: boolean) => {
		setEditingIds(prev => {
			const next = new Set(prev)
			if (editing) {
				next.add(id)
			}
			else {
				next.delete(id)
			}
			return next
		})
	}, [])

	const refresh = useCallback(async () => {
		await load(filter)
	}, [filter, load])

	const onChangeFilter = (filter: TodoFilter) => {
		setFilter(filter)
		setEditingIds(new Set())
	}

	return (
		<section className={styles.todo}>
			<TodoHeader
				refresh={refresh}
			/>

			<TodoFilters
				active={filter}
				counts={counts}
				onChange={onChangeFilter}
			/>

			{loading && (
				<div className={styles.loader}>
					<Spin />
				</div>
			)}

			{error && (
				<div className={styles.alert}>
					<Alert type="error" message={error} showIcon />
				</div>
			)}

			{!loading && (
				<TodoList
					items={items}
					onEditingChange={handleEditingChange}
					refresh={refresh}
				/>
			)}
		</section>
	)
}
