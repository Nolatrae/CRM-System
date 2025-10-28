import { useState } from 'react'
import styles from './styles.module.scss'

type Props = {
	onAdd: (title: string) => Promise<void>
}

export default function TodoHeader({ onAdd }: Props) {
	const [title, setTitle] = useState('')
	const [msg, setMsg] = useState<string | null>(null)
	const [err, setErr] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	function validate(value: string) {
		const v = value.trim()
		if (!v) {
			return 'Это поле не может быть пустым'
		}
		if (v.length < 2) {
			return 'Минимальная длина текста 2 символа'
		}
		if (v.length > 64) {
			return 'Максимальная длина текста 64 символа'
		}
		return null
	}

	async function handleAdd() {
		setMsg(null)
		const vErr = validate(title)
		if (vErr) {
			setErr(vErr)
			return
		}
		try {
			setLoading(true)
			await onAdd(title.trim())
			setTitle('')
			setErr(null)
			setMsg('Задача успешно создана')
			setTimeout(() => setMsg(null), 1500)
		} catch (e: any) {
			setErr(e.message || 'Не удалось создать задачу')
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
				<button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd} disabled={loading}>
					Add
				</button>
			</div>
			<div className={styles.messages}>
				{err && <div className={`${styles.note} ${styles.noteError}`}>{err}</div>}
				{msg && <div className={`${styles.note} ${styles.noteSuccess}`}>{msg}</div>}
			</div>
		</div>
	)
}
