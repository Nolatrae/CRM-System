import type { MetaResponse, Todo, TodoFilter, TodoRequest, TodoInfo } from '../types/todo'

const BASE_URL = 'https://easydev.club/api/v1'

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
	const res = await fetch(input, {
		headers: { 'Content-Type': 'application/json' },
		...init,
	})

	if (!res.ok) {
		const msg = await res.text().catch(() => '')
		throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`)
	}

	if (res.status === 204) {
		return undefined as T
	}

	const ct = res.headers.get('content-type') || ''
	if (!ct.includes('application/json')) {
		return undefined as T
	}

	return res.json() as Promise<T>
}


export function getTodos(filter: TodoFilter) {
	const url = `${BASE_URL}/todos?filter=${filter}`
	return http<MetaResponse<Todo, TodoInfo>>(url)
}

export function createTodo(req: TodoRequest) {
	return http<Todo>(`${BASE_URL}/todos`, {
		method: 'POST',
		body: JSON.stringify(req),
	})
}

export function updateTodo(id: number, req: TodoRequest) {
	return http<Todo>(`${BASE_URL}/todos/${id}`, {
		method: 'PUT',
		body: JSON.stringify(req),
	})
}

export async function deleteTodo(id: number): Promise<void> {
	await http<undefined>(`${BASE_URL}/todos/${id}`, { method: 'DELETE' })
}
