import { useState } from 'react'
import styles from './styles.module.scss'
import clsx from 'clsx'
import { validateTitle } from '@helpers/validation'
import { createTodo } from '@api/todos'

type Props = {
	refresh: () => Promise<void>
}

export default function TodoHeader({ refresh }: Props) {
	const [title, setTitle] = useState('')
	const [msg, setMsg] = useState<string | null>(null)
	const [err, setErr] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function handleAdd() {
		setMsg(null)
		const vErr = validateTitle(title)
		if (vErr) {
			setErr(vErr)
			return
		}
		try {
			setLoading(true)
			await createTodo({ title: title.trim() })
			setTitle('')
			setErr(null)
			await refresh()
			setTimeout(() => setMsg(null), 1500)
		} catch (e: any) {
			const m = e?.message || 'Не удалось создать задачу'
			setErr(m)
			console.error(m)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.controls}>
				<input
					className={styles.input}
					placeholder="Введите задачу"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<button
					className={clsx(styles.btn, styles.btnPrimary)}
					onClick={handleAdd}
					disabled={loading}
				>
					Добавить
				</button>

				<div className={styles.messages}>
					{err && <div className={clsx(styles.note, styles.noteError)}>{err}</div>}
					{msg && <div className={clsx(styles.note, styles.noteSuccess)}>{msg}</div>}
				</div>
			</div>
		</div>
	)
}
