import { CreateCourseDTO, Course } from './models';
import { validateCoursesArray } from './validator';

console.log('--- Запуск проверки TypeScript в УИС ---');

// Проверяем создание DTO
const newCourseData: CreateCourseDTO = {
    code: 'CS101',
    title: 'Введение в программирование',
    credits: 5
};

console.log('DTO для создания курса:', newCourseData);

// Имитируем входящие данные (например, из API или файла)
const rawData = [
    {
        id: '1',
        code: 'CS101',
        title: 'Введение в программирование',
        credits: 5,
        createdAt: '2026-11-04'
    },
    {
        id: '2',
        code: 'BAD_COURSE',
        title: 'Некорректный курс (нет credits и даты)'
    }
];

// Безопасная валидация через Type Guard
const validatedCourses = validateCoursesArray(rawData);
console.log('Успешно валидированные курсы:', validatedCourses);