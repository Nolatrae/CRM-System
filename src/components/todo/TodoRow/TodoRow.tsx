import { useState } from 'react'
import { Checkbox, Button, Form, Input, Space, Typography } from 'antd'
import type { Todo } from '../../../types/todo'

type Props = {
	todo: Todo
	onToggle: (id: number, isDone: boolean) => Promise<void>
	onDelete: (id: number) => Promise<void>
	onSaveTitle: (id: number, title: string) => Promise<void>
	onEditingChange: (id: number, editing: boolean) => void
}

export default function TodoRow({ todo, onToggle, onDelete, onSaveTitle, onEditingChange }: Props) {
	const [editing, setEditing] = useState(false)
	const [saving, setSaving] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const [toggling, setToggling] = useState(false)
	const [form] = Form.useForm()

	const busy = saving || deleting || toggling

	const save = async () => {
		try {
			const { title } = await form.validateFields()
			setSaving(true)
			await onSaveTitle(todo.id, title.trim())
			setEditing(false)
		} finally {
			setSaving(false)
			onEditingChange(todo.id, false)
		}
	}

	const startEdit = () => {
		if (busy) {
			return
		}
		setEditing(true)
		onEditingChange(todo.id, true)
	}

	const cancel = () => {
		if (busy) {
			return
		}
		setEditing(false)
		form.setFieldsValue({ title: todo.title })
		onEditingChange(todo.id, false)
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
		<Space style={{ width: '100%', justifyContent: 'space-between' }}>
			<Space>
				<Checkbox
					checked={todo.isDone}
					onChange={(e) => toggle(e.target.checked)}
					disabled={busy}
				/>
				{editing ? (
					<Form form={form} initialValues={{ title: todo.title }}>
						<Form.Item
							name="title"
							rules={[
								{ required: true, message: 'Это поле не может быть пустым' },
								{ min: 2, message: 'Минимум 2 символа' },
								{ max: 64, message: 'Максимум 64 символа' },
							]}
							style={{ marginBottom: 0, minWidth: 260 }}
						>
							<Input maxLength={64} disabled={busy} />
						</Form.Item>
					</Form>
				) : (
					<Typography.Text delete={todo.isDone}>{todo.title}</Typography.Text>
				)}
			</Space>

			<Space>
				{editing ? (
					<>
						<Button type="primary" onClick={save} loading={saving} disabled={busy}>
							Сохранить
						</Button>
						<Button onClick={cancel} disabled={busy}>Отмена</Button>
					</>
				) : (
					<Button type="primary" onClick={startEdit} disabled={busy}>
						Редактировать
					</Button>
				)}
				<Button danger onClick={remove} loading={deleting} disabled={busy}>
					Удалить
				</Button>
			</Space>
		</Space>
	)
}
