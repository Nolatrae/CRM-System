import { useState } from 'react'
import { Checkbox, Button, Form, Input, Space, Typography } from 'antd'
import { deleteTodo, updateTodo } from '@api/todos'
import type { Todo } from '../../../types/todo'

type Props = {
	todo: Todo
	refresh: () => Promise<void>
	onEditingChange: (id: number, editing: boolean) => void
}

export default function TodoRow({ todo, refresh, onEditingChange }: Props) {
	const [editing, setEditing] = useState(false)
	const [saving, setSaving] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const [toggling, setToggling] = useState(false)
	const [form] = Form.useForm()

	const busy = saving || deleting || toggling

	const startEdit = () => {
		if (busy) return
		setEditing(true)
		onEditingChange(todo.id, true)
		// проставим текущее значение в форму (на случай если задача изменилась снаружи)
		form.setFieldsValue({ title: todo.title })
	}

	const cancel = () => {
		if (busy) return
		setEditing(false)
		// откатываем текст инпута к исходному тайтлу
		form.setFieldsValue({ title: todo.title })
		onEditingChange(todo.id, false)
	}

	const save = async () => {
		if (busy) return
		try {
			// проверяем валидацию antd
			const { title } = await form.validateFields()
			const newTitle = (title ?? '').trim()
			if (!newTitle) return

			setSaving(true)
			await updateTodo(todo.id, { title: newTitle })
			await refresh()

			setEditing(false)
			onEditingChange(todo.id, false)
		} catch (e: any) {
			// если это именно ошибка валидации формы (antd ValidationError),
			// то сюда тоже попадём — но это ок, мы просто не падаем
			console.error(e?.message || 'Не удалось сохранить название')
		} finally {
			setSaving(false)
		}
	}

	const toggle = async (checked: boolean) => {
		if (busy) return
		try {
			setToggling(true)
			await updateTodo(todo.id, { isDone: checked })
			await refresh()
		} catch (e: any) {
			console.error(e?.message || 'Не удалось изменить статус задачи')
		} finally {
			setToggling(false)
		}
	}

	const remove = async () => {
		if (busy) return
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
		<Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
			{/* Левая часть: чекбокс + либо инпут, либо текст */}
			<Space align="start">
				<Checkbox
					checked={todo.isDone}
					onChange={(e) => toggle(e.target.checked)}
					disabled={busy}
				/>

				{editing ? (
					<Form
						form={form}
						initialValues={{ title: todo.title }}
						style={{ marginBottom: 0 }}
					>
						<Form.Item
							name="title"
							rules={[
								{ required: true, message: 'Это поле не может быть пустым' },
								{ min: 2, message: 'Минимум 2 символа' },
								{ max: 64, message: 'Максимум 64 символа' },
							]}
							style={{ marginBottom: 0, minWidth: 260 }}
						>
							<Input
								maxLength={64}
								disabled={busy}
							/>
						</Form.Item>
					</Form>
				) : (
					<Typography.Text delete={todo.isDone}>
						{todo.title}
					</Typography.Text>
				)}
			</Space>

			{/* Правая часть: кнопки действий */}
			<Space>
				{editing ? (
					<>
						<Button
							type="primary"
							onClick={save}
							loading={saving}
							disabled={busy}
						>
							Сохранить
						</Button>

						<Button
							onClick={cancel}
							disabled={busy}
						>
							Отмена
						</Button>
					</>
				) : (
					<Button
						type="primary"
						onClick={startEdit}
						disabled={busy}
					>
						Редактировать
					</Button>
				)}

				<Button
					danger
					onClick={remove}
					loading={deleting}
					disabled={busy}
				>
					Удалить
				</Button>
			</Space>
		</Space>
	)
}
