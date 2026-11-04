const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// База данных курсов
let courses = [
    { id: 'c1', code: 'CS101', title: 'Введение в программирование', credits: 4, category: 'CS' },
    { id: 'c2', code: 'CS302', title: 'Клиент-серверные приложения', credits: 5, category: 'CS' },
    { id: 'c3', code: 'MATH201', title: 'Дискретная математика', credits: 3, category: 'MATH' }
];

// База данных студентов (Самостоятельное задание)
let students = [
    { id: 's1', firstName: 'Иван', lastName: 'Иванов', studentCard: 'ST1001', groupId: 'CS-21' },
    { id: 's2', firstName: 'Айша', lastName: 'Усенова', studentCard: 'ST1002', groupId: 'CS-21' },
    { id: 's3', firstName: 'Петр', lastName: 'Петров', studentCard: 'ST1003', groupId: 'MATH-22' }
];

// --- COURSES API ---
app.get('/api/v1/courses', (req, res) => {
    const { category, search } = req.query;
    let result = [...courses];
    if (category) result = result.filter(c => c.category.toLowerCase() === category.toLowerCase());
    if (search) result = result.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    res.status(200).json({ success: true, count: result.length, data: result });
});

app.get('/api/v1/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === req.params.id);
    if (!course) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Курс не найден' } });
    res.status(200).json({ success: true, data: course });
});

app.post('/api/v1/courses', (req, res) => {
    const { code, title, credits, category } = req.body;
    if (!code || !title || !credits) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Заполните обязательные поля' } });
    }
    const newCourse = { id: `c${courses.length + 1}`, code, title, credits: Number(credits), category: category || 'GENERAL' };
    courses.push(newCourse);
    res.status(201).json({ success: true, data: newCourse });
});

app.put('/api/v1/courses/:id', (req, res) => {
    const index = courses.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Курс не найден' } });
    const { code, title, credits, category } = req.body;
    courses[index] = { id: req.params.id, code, title, credits, category };
    res.status(200).json({ success: true, data: courses[index] });
});

app.delete('/api/v1/courses/:id', (req, res) => {
    const index = courses.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Курс не найден' } });
    courses.splice(index, 1);
    res.status(204).send();
});

// --- STUDENTS API (Самостоятельное задание) ---
app.get('/api/v1/students', (req, res) => {
    const { groupId } = req.query;
    let result = [...students];
    if (groupId) result = result.filter(s => s.groupId.toLowerCase() === groupId.toLowerCase());
    res.status(200).json({ success: true, count: result.length, data: result });
});

app.post('/api/v1/students', (req, res) => {
    const { firstName, lastName, studentCard, groupId } = req.body;
    if (!firstName || !lastName || !studentCard) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Поля firstName, lastName и studentCard обязательны' } });
    }
    const newStudent = { id: `s${students.length + 1}`, firstName, lastName, studentCard, groupId: groupId || 'GENERAL' };
    students.push(newStudent);
    res.status(201).json({ success: true, data: newStudent });
});

app.listen(PORT, () => console.log(`[UIS API] Сервер запущен на http://localhost:${PORT}`));