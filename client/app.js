const API_BASE_URL = 'http://localhost:5000/api/v1';

// Элементы DOM
const courseForm = document.getElementById('courseForm');
const coursesTbody = document.getElementById('coursesTbody');
const loadingSpinner = document.getElementById('loadingSpinner');
const btnRefresh = document.getElementById('btnRefresh');
const formAlert = document.getElementById('formAlert');
const searchInput = document.getElementById('searchInput');

let allCourses = []; // Хранилище для фильтрации

// 1. Загрузка и рендеринг курсов (GET)
async function fetchAndRenderCourses() {
    showSpinner(true);
    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        
        const result = await response.json();
        allCourses = result.data;
        renderCoursesTable(allCourses);
    } catch (err) {
        showAlert(`Не удалось загрузить данные: ${err.message}`, 'error');
    } finally {
        showSpinner(false);
    }
}

// 2. Рендеринг таблицы курсов
function renderCoursesTable(courses) {
    coursesTbody.innerHTML = '';
    
    if (courses.length === 0) {
        coursesTbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Курсы отсутствуют</td></tr>`;
        return;
    }

    courses.forEach(course => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${escapeHtml(course.code)}</strong></td>
            <td>${escapeHtml(course.title)}</td>
            <td>${course.credits} ECTS</td>
            <td>
                <button class="btn btn-danger" style="padding: 4px 8px; font-size: 12px;" onclick="deleteCourse('${course.id}')">Удалить</button>
            </td>
        `;
        coursesTbody.appendChild(tr);
    });
}

// 3. Обработка отправки формы (POST) + Валидация на стороне клиента
courseForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы[cite: 30]

    const code = document.getElementById('courseCode').value.trim();
    const title = document.getElementById('courseTitle').value.trim();
    const credits = parseInt(document.getElementById('courseCredits').value, 10);

    // Самостоятельное задание: Валидация формата кода курса (2-3 буквы и 3 цифры, например: CS101)
    const codeRegex = /^[A-Za-zА-Яа-я]{2,3}\d{3}$/;
    if (!codeRegex.test(code)) {
        showAlert('Ошибка валидации: код курса должен состоять из 2-3 букв и 3 цифр (например, CS101)', 'error');
        return;
    }

    const newCourse = { code, title, credits };

    try {
        const response = await fetch(`${API_BASE_URL}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCourse)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'Ошибка сохранения');
        }

        showAlert('Курс успешно добавлен!', 'success');
        courseForm.reset();
        fetchAndRenderCourses(); // Обновляем список
    } catch (err) {
        showAlert(err.message, 'error');
    }
});

// 4. Самостоятельное задание: Реализация удаления курса (DELETE)
async function deleteCourse(courseId) {
    if (!confirm('Вы уверены, что хотите удалить этот курс?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
            method: 'DELETE'
        });

        if (!response.ok && response.status !== 204) {
            throw new Error('Не удалось удалить курс');
        }

        showAlert('Курс успешно удален', 'success');
        fetchAndRenderCourses();
    } catch (err) {
        showAlert(err.message, 'error');
    }
}

// 5. Самостоятельное задание: Поиск / Фильтрация в реальном времени
searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    const filtered = allCourses.filter(course => 
        course.title.toLowerCase().includes(searchText) || 
        course.code.toLowerCase().includes(searchText)
    );
    renderCoursesTable(filtered);
});

// Вспомогательные функции
function showSpinner(visible) {
    if (visible) loadingSpinner.classList.remove('hidden');
    else loadingSpinner.classList.add('hidden');
}

function showAlert(msg, type) {
    formAlert.textContent = msg;
    formAlert.className = `alert alert-${type}`;
    setTimeout(() => { formAlert.classList.add('hidden'); }, 4000);
}

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Инициализация при загрузке
btnRefresh.addEventListener('click', fetchAndRenderCourses);
document.addEventListener('DOMContentLoaded', fetchAndRenderCourses);