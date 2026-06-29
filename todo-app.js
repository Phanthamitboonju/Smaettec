// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const remainingCount = document.getElementById('remainingCount');

// State
let todos = [];
let currentFilter = 'all';
const STORAGE_KEY = 'todos';

// Initialize
function init() {
    loadTodos();
    renderTodos();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTodos();
        });
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);
    clearAllBtn.addEventListener('click', clearAll);
}

// Add Todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (!text) {
        alert('กรุณาเพิ่มงาน!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString('th-TH')
    };

    todos.unshift(todo);
    todoInput.value = '';
    todoInput.focus();
    saveTodos();
    renderTodos();
}

// Render Todos
function renderTodos() {
    todoList.innerHTML = '';

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'completed') return todo.completed;
        if (currentFilter === 'active') return !todo.completed;
        return true;
    });

    if (filteredTodos.length === 0) {
        emptyState.style.display = 'block';
        todoList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        todoList.style.display = 'block';

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <span class="todo-date">${todo.createdAt}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">ลบ</button>
            `;
            todoList.appendChild(li);
        });
    }

    updateStats();
}

// Toggle Todo
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Delete Todo
function deleteTodo(id) {
    if (confirm('คุณแน่ใจหรือว่าต้องการลบงานนี้?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        renderTodos();
    }
}

// Clear Completed
function clearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert('ไม่มีงานที่เสร็จแล้ว');
        return;
    }

    if (confirm(`ลบ ${completedCount} งานที่เสร็จแล้ว?`)) {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        currentFilter = 'all';
        filterBtns.forEach(b => b.classList.remove('active'));
        filterBtns[0].classList.add('active');
        renderTodos();
    }
}

// Clear All
function clearAll() {
    if (todos.length === 0) {
        alert('ไม่มีงานอยู่');
        return;
    }

    if (confirm('ลบงานทั้งหมด? การกระทำนี้ไม่สามารถยกเลิกได้')) {
        todos = [];
        saveTodos();
        currentFilter = 'all';
        filterBtns.forEach(b => b.classList.remove('active'));
        filterBtns[0].classList.add('active');
        renderTodos();
    }
}

// Update Stats
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const remaining = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    remainingCount.textContent = remaining;

    clearCompletedBtn.disabled = completed === 0;
    clearAllBtn.disabled = total === 0;
}

// Local Storage
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        todos = JSON.parse(stored);
    }
}

// Utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start Application
init();