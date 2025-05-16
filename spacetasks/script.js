// Seletores
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('spacetasks-tasks')) || [];
let currentFilter = 'all';

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText === '') return;
  tasks.push({ text: taskText, done: false });
  saveTasks();
  input.value = '';
  renderTasks();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentFilter = this.dataset.filter;
    renderTasks();
  });
});

function renderTasks() {
  list.innerHTML = '';
  let filtered = tasks;
  if (currentFilter === 'pending') filtered = tasks.filter(t => !t.done);
  if (currentFilter === 'done') filtered = tasks.filter(t => t.done);
  filtered.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center' + (task.done ? ' completed' : '');
    li.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-light rounded-circle check-btn" title="Concluir" data-idx="${idx}">
          <i class="bi ${task.done ? 'bi-check2-circle' : 'bi-circle'}"></i>
        </button>
        <span>${task.text}</span>
      </div>
      <button class="btn btn-sm btn-outline-light ms-2 remove-btn" title="Remover" data-idx="${idx}"><i class="bi bi-trash"></i></button>
    `;
    list.appendChild(li);
  });
  // Eventos dos botões
  document.querySelectorAll('.check-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = this.dataset.idx;
      tasks[idx].done = !tasks[idx].done;
      saveTasks();
      renderTasks();
    };
  });
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = this.dataset.idx;
      tasks.splice(idx, 1);
      saveTasks();
      renderTasks();
    };
  });
}

function saveTasks() {
  localStorage.setItem('spacetasks-tasks', JSON.stringify(tasks));
}

// Inicialização
renderTasks(); 