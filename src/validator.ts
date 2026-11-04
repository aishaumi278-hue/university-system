import { Course, isCourse } from './models';

// Функция для безопасной фильтрации массива данных с использованием Type Guard
export function validateCoursesArray(input: unknown): Course[] {
    if (!Array.isArray(input)) {
        throw new Error('Ожидался массив данных курсов');
    }

    const validCourses: Course[] = [];
    
    for (const item of input) {
        if (isCourse(item)) {
            validCourses.push(item);
        } else {
            console.warn('Обнаружен некорректный объект курса, пропущен:', item);
        }
    }

    return validCourses;
}