import { useCallback, useEffect, useState } from 'react'
import { createTodo, deleteTodo, getTodos, updateTodo } from '../../api/todos'
import type { Todo, TodoFilter, TodoInfo } from '../../types/todo'
import TodoHeader from '../../components/todo/TodoHeader/TodoHeader'
import TodoFilters from '../../components/todo/TodoFilters/TodoFilters'
import TodoList from '../../components/todo/TodoList/TodoList'
import styles from './styles.module.scss'
import { Alert, Spin } from 'antd'

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
			setError(e.message || 'Ошибка загрузки')
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
		const id = setInterval(() => load(filter), 5000)
		return () => clearInterval(id)
	}, [filter, load, editingIds])

	const handleEditingChange = (id: number, editing: boolean) => {
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
	}

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

	const onChangeFilter = (filter: TodoFilter) => {
		setFilter(filter)
		setEditingIds(new Set())
	}

	return (
		<section className={styles.todo}>
			<TodoHeader
				onAdd={handleAdd}
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

			{!loading && !error && (
				<TodoList
					items={items}
					onToggle={handleToggle}
					onDelete={handleDelete}
					onSaveTitle={handleSaveTitle}
					onEditingChange={handleEditingChange}
				/>
			)}
		</section>
	)
}
