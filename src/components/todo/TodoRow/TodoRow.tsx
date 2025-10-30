import { useState } from 'react'
import type { Todo } from '../../../types/todo'
import styles from './styles.module.scss'
import clsx from 'clsx'
import { validateTitle } from '@helpers/validation'
import { deleteTodo, updateTodo } from '@api/todos'

type Props = {
	todo: Todo
	refresh: () => Promise<void>
}

export default function TodoRow({ todo, refresh }: Props) {
	const [editing, setEditing] = useState(false)
	const [value, setValue] = useState(todo.title)
	const [saving, setSaving] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const [toggling, setToggling] = useState(false)

	const busy = saving || deleting || toggling

	const cancel = () => {
		if (busy) {
			return
		}
		setValue(todo.title)
		setEditing(false)
	}

	const save = async () => {
		if (busy) {
			return
		}
		const vErr = validateTitle(value)
		if (vErr) {
			return
		}
		try {
			setSaving(true)
			await updateTodo(todo.id, {
				title: value.trim()
			})
			await refresh()
			setEditing(false)
		} catch (e: any) {
			console.error(e?.message || 'Не удалось сохранить название')
		} finally {
			setSaving(false)
		}
	}

	const toggle = async (checked: boolean) => {
		if (busy) {
			return
		}
		try {
			setToggling(true)
			await updateTodo(todo.id, { isDone: checked })
			await refresh()
		} catch (e: any) {
			console.error(e?.message || 'Не удалось изменить статус')
		} finally {
			setToggling(false)
		}
	}

	const remove = async () => {
		if (busy) {
			return
		}
		try {
			setDeleting(true)
			await deleteTodo(todo.id)
			await refresh()
		} catch (e: any) {
			console.error(e?.message || 'Не удалось удалить задачу')
		} finally {
			setDeleting(false)
		}
	}

	return (
		<div className={clsx(styles.row, busy && styles.rowBusy)}>
			<label>
				<input
					type="checkbox"
					checked={todo.isDone}
					onChange={(e) => toggle(e.target.checked)}
					disabled={busy}
				/>
			</label>

			<div>
				{editing ? (
					<input
						className={styles.input}
						value={value}
						onChange={(e) => setValue(e.target.value)}
						maxLength={64}
						autoFocus
						disabled={busy}
					/>
				) : (
					<span className={clsx(todo.isDone && styles.titleDone)}>{todo.title}</span>
				)}
			</div>

			<div className={styles.actions}>
				{editing ? (
					<>
						<button
							className={clsx(styles.btn, styles.btnPrimary)}
							disabled={busy}
							onClick={save}
						>
							Сохранить
						</button>
						<button className={styles.btn} disabled={busy} onClick={cancel}>
							Отмена
						</button>
					</>
				) : (
					<button
						className={clsx(styles.btn, styles.btnPrimary)}
						disabled={busy}
						onClick={() => setEditing(true)}
					>
						Редактировать
					</button>
				)}
				<button
					className={clsx(styles.btn, styles.btnDanger)}
					disabled={busy}
					onClick={remove}
				>
					Удалить
				</button>
			</div>
		</div>
	)
}
