import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'

type Props = { onAdd: (title: string) => Promise<void> }

export default function TodoHeader({ onAdd }: Props) {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)

	const onFinish = async (values: { title: string }) => {
		try {
			setLoading(true)
			await onAdd(values.title.trim())
			form.resetFields()
			message.success('Задача успешно создана')
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
				<Input placeholder="Введите задачу" />
			</Form.Item>

			<Form.Item>
				<Button type="primary" htmlType="submit" loading={loading}>
					Добавить
				</Button>
			</Form.Item>
		</Form>
	)
}
