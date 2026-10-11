const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const errorEl = document.getElementById("error");
const clearBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter");

let tasks = [];
let currentFilter = "all";
let nextId = 1;

function addTask() {
  const text = input.value;
  if (text.trim() === '') {  // Пустая строка (в том числе из одних пробелов) не добавляется; показывается сообщение «Введите текст задачи»
    errorEl.hidden = false;
    input.value = "";
    return
  }

  tasks.push({ id: nextId++, text: text, done: false });
  errorEl.hidden = true;
  input.value = "";
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);

  task.done = !task.done; // Повторный клик убирает зачёркивание, одиночный клик по тексту задачи зачёркивает её

  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id); // Клик по кнопке «✕» убирает задачу из списка и из счётчика
  render();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.done)
  render();
}

function getVisibleTasks() { // «Активные» показывают только невыполненные, «Выполненные» — только выполненные, «Все» — все задачи
  if (currentFilter === 'all') {
    return tasks;
  }

  else if (currentFilter === 'active') {
    return tasks.filter((t) => !t.done)
  }
  else {
    return tasks.filter((t) => t.done)
  }
}

function updateCounter() {
  counter.textContent = "Активных задач: " + tasks.filter(t => !t.done).length // Счётчик показывает количество невыполненных задач
}

function render() {
  const visible = getVisibleTasks();
  list.innerHTML = ''; // Можно добавлять любое количество задач подряд, список продолжает работать, На странице ровно столько задач, сколько добавлено, без повторов
  for (let i = 0; i < visible.length; i++) { // По одиночному клику задача добавляется в список
    const task = visible[i];

    const li = document.createElement("li");
    li.className = "task";


    if (task.done) {
      li.classList.add("completed");
    }


    const span = document.createElement("span");
    span.className = "task__text";
    span.textContent = task.text;
    span.addEventListener("click", () => toggleTask(task.id));

    const del = document.createElement("button");
    del.className = "task__del";
    del.textContent = "✕";
    del.addEventListener("click", () => deleteTask(task.id));
    list.appendChild(li);
    li.appendChild(span);
    li.appendChild(del);

  }

  updateCounter();

}

addBtn.addEventListener("click", addTask); // По одиночному клику задача добавляется в список
clearBtn.addEventListener("click", clearCompleted);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();
