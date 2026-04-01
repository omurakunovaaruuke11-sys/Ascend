// ====================== ДАННЫЕ ======================
let goals = [];

// Список челленджей (можно легко расширять)
const challenges = [
    "Выполни 5 минут растяжки!",
    "Выучи 5 новых слов на английском!",
    "Выпей 2 литра воды за сегодня!",
    "Напиши 3 вещи, за которые ты благодарен сегодня!",
    "Сделай 10 приседаний или отжиманий!",
    "Прочитай 10 страниц книги или статьи",
    "Сделай 5-минутную медитацию",
    "Наведи порядок на рабочем столе",
    "Сходи на прогулку 15 минут",
    "Сделай комплимент себе или близкому"
];

// ====================== ОСНОВНЫЕ ФУНКЦИИ ======================

// Загрузка целей из localStorage
function loadGoals() {
    const savedGoals = localStorage.getItem('glowUpGoals');
    if (savedGoals) {
        goals = JSON.parse(savedGoals);
    }
}

// Сохранение целей в localStorage
function saveGoals() {
    localStorage.setItem('glowUpGoals', JSON.stringify(goals));
}

// Добавление новой цели
function addGoal() {
    const input = document.getElementById('goal-input');
    const text = input.value.trim();

    if (text === '') return;

    // Проверка на дубликат
    if (goals.some(goal => goal.text.toLowerCase() === text.toLowerCase())) {
        alert('Такая цель уже есть!');
        return;
    }

    goals.push({
        id: Date.now(),           // уникальный id
        text: text,
        done: false
    });

    input.value = '';
    renderGoals();
    updateProgress();
    saveGoals();
}

// Переключение статуса выполнения
function toggleDone(id) {
    goals = goals.map(goal => 
        goal.id === id ? { ...goal, done: !goal.done } : goal
    );
    
    renderGoals();
    updateProgress();
    saveGoals();
}

// Удаление цели
function deleteGoal(id) {
    if (confirm('Удалить эту цель?')) {
        goals = goals.filter(goal => goal.id !== id);
        renderGoals();
        updateProgress();
        saveGoals();
    }
}

// Рендер списка целей
function renderGoals() {
    const list = document.getElementById('goal-list');
    list.innerHTML = '';

    if (goals.length === 0) {
        list.innerHTML = `
            <li style="opacity: 0.6; text-align: center; padding: 20px; font-style: italic;">
                Добавь первую цель на сегодня ✨
            </li>`;
        return;
    }

    goals.forEach(goal => {
        const item = document.createElement('li');
        item.className = `goal-item ${goal.done ? 'completed' : ''}`;
        
        item.innerHTML = `
            <input type="checkbox" ${goal.done ? 'checked' : ''}>
            <span class="goal-text">${goal.text}</span>
            <button class="delete-btn" title="Удалить цель">×</button>
        `;

        // Обработчики событий
        item.querySelector('input').addEventListener('change', () => toggleDone(goal.id));
        item.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // чтобы не срабатывал клик по li
            deleteGoal(goal.id);
        });

        list.appendChild(item);
    });
}

// Обновление прогресса
function updateProgress() {
    const doneCount = goals.filter(g => g.done).length;
    const total = goals.length;

    const stats = document.getElementById('stats-info');
    const fill = document.getElementById('progress-fill');

    stats.textContent = `${doneCount} выполнено из ${total}`;

    const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
    fill.style.width = `${percent}%`;
}

// Новый челлендж
function newChallenge() {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    document.getElementById('challenge-text').textContent = challenges[randomIndex];
}

// ====================== ИНИЦИАЛИЗАЦИЯ ======================
function init() {
    // Загружаем сохранённые цели
    loadGoals();

    // Обработчик кнопки "Добавить"
    const addButton = document.getElementById('add-btn');
    addButton.addEventListener('click', addGoal);

    // Добавление цели по нажатию Enter
    const goalInput = document.getElementById('goal-input');
    goalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addGoal();
        }
    });

    // Кнопка нового челленджа
    const challengeBtn = document.getElementById('new-challenge-btn');
    challengeBtn.addEventListener('click', newChallenge);

    // Первоначальный рендер
    renderGoals();
    updateProgress();

    // Показываем первый случайный челлендж
    newChallenge();
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);
