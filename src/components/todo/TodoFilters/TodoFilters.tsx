import clsx from 'clsx'
import type { TodoFilter, TodoInfo } from '../../../types/todo'
import styles from './styles.module.scss'

type Props = {
	active: TodoFilter
	counts: TodoInfo | null
	onChange: (f: TodoFilter) => void
}

export default function TodoFilters({ active, counts, onChange }: Props) {
	const c = counts ?? { all: 0, inWork: 0, completed: 0 }

	const Tab = ({
		k,
		label,
		count,
	}: { k: TodoFilter; label: string; count: number }) => (
		<button
			onClick={() => onChange(k)}
			className={clsx(styles.tab, active === k && styles.tabActive)}
			type="button"
		>
			{label} <span className={styles.tabCount}>({count})</span>
		</button>
	)

	return (
		<div className={styles.filters}>
			<Tab k="all" label="Все" count={c.all} />
			<Tab k="inWork" label="В работе" count={c.inWork} />
			<Tab k="completed" label="Сделано" count={c.completed} />
		</div>
	)
}
