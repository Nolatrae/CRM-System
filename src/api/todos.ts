import axios from 'axios'
import type { MetaResponse, Todo, TodoFilter, TodoRequest, TodoInfo } from '../types/todo'

const BASE_URL = 'https://easydev.club/api/v1'

const api = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
})

export async function getTodos(filter: TodoFilter) {
	const { data } = await api.get<MetaResponse<Todo, TodoInfo>>('/todos', {
		params: { filter }
	})
	return data
}

export async function createTodo(req: TodoRequest) {
	const { data } = await api.post<Todo>('/todos', req)
	return data
}

export async function updateTodo(id: number, req: TodoRequest) {
	const { data } = await api.put<Todo>(`/todos/${id}`, req)
	return data
}

export async function deleteTodo(id: number): Promise<void> {
	await api.delete(`/todos/${id}`)
}