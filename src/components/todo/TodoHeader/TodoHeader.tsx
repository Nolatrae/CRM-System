import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { createTodo } from '@api/todos'

type Props = {
	refresh: () => Promise<void>
}

export default function TodoHeader({ refresh }: Props) {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)

	const onFinish = async (values: { title: string }) => {
		const rawTitle = values.title ?? ''
		const title = rawTitle.trim()

		if (!title) {
			message.error('Это поле не может быть пустым')
			return
		}

		try {
			setLoading(true)
			await createTodo({ title })
			form.resetFields()
			message.success('Задача успешно создана')
			await refresh()
		} catch (e: any) {
			message.error(e?.message || 'Не удалось создать задачу')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Form
			form={form}
			layout="inline"
			onFinish={onFinish}
			style={{ marginBottom: 16, gap: 12, flexWrap: 'wrap' }}
		>
			<Form.Item
				name="title"
				rules={[
					{ required: true, message: 'Это поле не может быть пустым' },
					{ min: 2, message: 'Минимальная длина текста 2 символа' },
					{ max: 64, message: 'Максимальная длина текста 64 символа' },
				]}
				style={{ flex: 1, minWidth: 260 }}
			>
				<Input
					placeholder="Введите задачу"
					disabled={loading}
				/>
			</Form.Item>

			<Form.Item>
				<Button
					type="primary"
					htmlType="submit"
					loading={loading}
				>
					Добавить
				</Button>
			</Form.Item>
		</Form>
	)
}
