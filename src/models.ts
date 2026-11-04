// Сущность курса в базе данных
export interface Course {
    id: string;
    code: string;
    title: string;
    credits: number;
    createdAt: string;
}

// DTO для создания курса (без id и createdAt, которые генерирует сервер)
export type CreateCourseDTO = Omit<Course, 'id' | 'createdAt'>;

// DTO для обновления курса (все поля опциональны)
export type UpdateCourseDTO = Partial<CreateCourseDTO>;

// Дженерик для пагинации ответов
export interface Paginated<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// Type Guard (защитник типа) для проверки входящих данных
export function isCourse(obj: unknown): obj is Course {
    if (typeof obj !== 'object' || obj === null) return false;
    const c = obj as Record<string, unknown>;
    return (
        typeof c.id === 'string' &&
        typeof c.code === 'string' &&
        typeof c.title === 'string' &&
        typeof c.credits === 'number' &&
        typeof c.createdAt === 'string'
    );
}