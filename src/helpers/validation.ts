export function validateTitle(raw: string): string | null {
	const v = raw.trim()
	if (!v) return 'Это поле не может быть пустым'
	if (v.length < 2) return 'Минимальная длина текста 2 символа'
	if (v.length > 64) return 'Максимальная длина текста 64 символа'
	return null
}
