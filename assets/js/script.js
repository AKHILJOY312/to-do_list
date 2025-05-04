// Select elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');

// Tasks array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Add new task
addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text !== '') {
    const newTask = {
      id: Date.now(),
      text,
      completed: false
    };
    tasks.push(newTask);
    taskInput.value = '';
    saveAndRender();
  }
});

// Handle checkbox + delete clicks
taskList.addEventListener('click', (e) => {
  const id = parseInt(e.target.closest('li')?.dataset.id);

  if (e.target.classList.contains('checkbox')) {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
  } else if (e.target.classList.contains('delete-btn')) {
    tasks = tasks.filter(task => task.id !== id);
  }

  saveAndRender();
});

// Double-click to edit task
taskList.addEventListener('dblclick', (e) => {
  if (e.target.classList.contains('task-text')) {
    const li = e.target.closest('li');
    const taskId = parseInt(li.dataset.id);
    const task = tasks.find(t => t.id === taskId);

    // Create an input field to edit the task
    const input = document.createElement('input');
    input.value = task.text;
    input.classList.add('edit-input');
    li.querySelector('.task-text').replaceWith(input);
    input.focus();

    // Save changes on Enter
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        task.text = input.value.trim();
        saveAndRender();
      }
    });

    // Cancel editing on Escape
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        saveAndRender();
      }
    });
  }
});

// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter.active')?.classList.remove('active');
    btn.classList.add('active');
    renderTasks(btn.dataset.filter);
  });
});

// Save to localStorage & render
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  const activeFilter = document.querySelector('.filter.active')?.dataset.filter || 'all';
  renderTasks(activeFilter);
}

// Render tasks based on filter
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';

  let filteredTasks = tasks;
  if (filter === 'completed') filteredTasks = tasks.filter(t => t.completed);
  if (filter === 'pending') filteredTasks = tasks.filter(t => !t.completed);

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
      <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
      <button class="delete-btn">🗑️</button>
    `;
    taskList.appendChild(li);
  });

  updateStatus();
}

// Update counts
function updateStatus() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  totalCount.textContent = `Total: ${total}`;
  completedCount.textContent = `Completed: ${completed}`;
  pendingCount.textContent = `Pending: ${pending}`;
}

// Initial render
saveAndRender();
