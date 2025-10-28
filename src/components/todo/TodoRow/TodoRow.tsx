import { useState } from 'react'
import type { Todo } from '../../../types/todo'
import styles from './styles.module.scss'

type Props = {
	todo: Todo
	onToggle: (id: number, isDone: boolean) => Promise<void>
	onDelete: (id: number) => Promise<void>
	onSaveTitle: (id: number, title: string) => Promise<void>
}

export default function TodoRow({ todo, onToggle, onDelete, onSaveTitle }: Props) {
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
		const v = value.trim()
		if (v.length < 2 || v.length > 64) {
			return
		}
		try {
			setSaving(true)
			await onSaveTitle(todo.id, v)
			setEditing(false)
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
			await onToggle(todo.id, checked)
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
			await onDelete(todo.id)
		} finally {
			setDeleting(false)
		}
	}

	return (
		<div className={`${styles.row} ${busy ? styles.rowBusy : ''}`}>
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
					<span className={todo.isDone ? styles.titleDone : ''}>{todo.title}</span>
				)}
			</div>

			<div className={styles.actions}>
				{editing ? (
					<>
						<button
							className={`${styles.btn} ${styles.btnPrimary}`}
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
						className={`${styles.btn} ${styles.btnPrimary}`}
						disabled={busy}
						onClick={() => setEditing(true)}
					>
						Редактировать
					</button>
				)}
				<button
					className={`${styles.btn} ${styles.btnDanger}`}
					disabled={busy}
					aria-busy={deleting}
					onClick={remove}
				>
					Удалить
				</button>
			</div>
		</div>
	)
}
