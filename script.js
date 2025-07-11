const model = document.querySelector(".model");
const addBtn = document.querySelector("#add-btn");
const closeBtn = document.querySelector("#close-icon");
const form = document.querySelector(".form");
const inputTask = document.querySelector("#inputTask");
const cards = document.querySelector(".cards");
const priorityColors = document.querySelectorAll(".priorityColor");
const deleteBtn = document.querySelector(".delete");
const filterColors = document.querySelectorAll(".color-filters .color");

const colors = ["red", "orange", "blue", "yellow"];
let modalPriorityColor = "red";
let taskArr = JSON.parse(localStorage.getItem("allTasks")) || [];
const lockClass = "ri-lock-fill";
const unlockClass = "ri-lock-unlock-fill";
let deleteMode = false;
let activeFilterColor = null;

// Open modal
addBtn.addEventListener("click", () => model.classList.add("show"));
closeBtn.addEventListener("click", () => model.classList.remove("show"));

// Create Task
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskValue = inputTask.value.trim();
  if (taskValue === "") {
    alert("Please enter your task");
    return;
  }
  let id = shortid();
  taskCreated(taskValue, id, modalPriorityColor);
  inputTask.value = "";
  model.classList.remove("show");
});

// Priority selection in modal
priorityColors.forEach(priorityColor => {
  priorityColor.addEventListener("click", () => {
    priorityColors.forEach(pc => pc.classList.remove("active"));
    priorityColor.classList.add("active");
    modalPriorityColor = priorityColor.classList[0];
  });
});

// Delete Mode
deleteBtn.addEventListener("click", () => {
  deleteMode = !deleteMode;
  deleteBtn.classList.toggle("active");
});

// Filter By Priority + All Tasks
filterColors.forEach(filterColor => {
  filterColor.addEventListener("click", () => {
    const selectedColor = filterColor.classList[1];
    if (selectedColor === "all") {
      activeFilterColor = null;
      filterColors.forEach(fc => fc.classList.remove("active"));
      filterColor.classList.add("active");
      showAllCards();
    } else {
      if (activeFilterColor === selectedColor) {
        activeFilterColor = null;
        filterColors.forEach(fc => fc.classList.remove("active"));
        showAllCards();
      } else {
        activeFilterColor = selectedColor;
        filterColors.forEach(fc => fc.classList.remove("active"));
        filterColor.classList.add("active");
        filterCardsByColor(selectedColor);
      }
    }
  });
});

function showAllCards() {
  document.querySelectorAll(".card").forEach(card => card.style.display = "block");
}

function filterCardsByColor(color) {
  document.querySelectorAll(".card").forEach(card => {
    const borderColor = getComputedStyle(card).borderTopColor.trim();
    const colorMap = {
      red: "rgb(244, 67, 54)",
      orange: "rgb(255, 152, 0)",
      blue: "rgb(33, 150, 243)",
      yellow: "rgb(255, 235, 59)"
    };
    card.style.display = borderColor === colorMap[color] ? "block" : "none";
  });
}

function taskCreated(task, id, color) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.borderTop = `8px solid ${getColorValue(color)}`;
  card.innerHTML = `
    <div class="card-top">
      <span class="card-id">${id}</span>
      <div class="task-lock">
        <i class="${lockClass}"></i>
      </div>
    </div>
    <div class="card-bottom" contenteditable="false">${task}</div>
  `;
  cards.appendChild(card);
  handleLock(card, id);
  handleColor(card, id);
  handleDelete(card, id);

  if (!taskArr.find(t => t.id === id)) {
    taskArr.push({ id, name: task, color });
    updateLocalStorage();
  }
}

function getColorValue(name) {
  const map = {
    red: "#f44336",
    orange: "#ff9800",
    blue: "#2196f3",
    yellow: "#ffeb3b"
  };
  return map[name];
}

function handleLock(card, id) {
  const lockIcon = card.querySelector(".task-lock i");
  const taskArea = card.querySelector(".card-bottom");
  lockIcon.addEventListener("click", () => {
    const isLocked = lockIcon.classList.contains(lockClass);
    lockIcon.className = isLocked ? unlockClass : lockClass;
    taskArea.contentEditable = !isLocked;
    if (isLocked) return;

    const idx = taskArr.findIndex(t => t.id === id);
    taskArr[idx].name = taskArea.innerText.trim();
    updateLocalStorage();
  });
}

function handleColor(card, id) {
  card.addEventListener("click", () => {
    if (deleteMode) return;
    const computedColor = getComputedStyle(card).borderTopColor.trim();
    const colorMap = {
      "rgb(244, 67, 54)": "red",
      "rgb(255, 152, 0)": "orange",
      "rgb(33, 150, 243)": "blue",
      "rgb(255, 235, 59)": "yellow"
    };
    let idx = colors.indexOf(colorMap[computedColor]) || 0;
    const nextColor = colors[(idx + 1) % colors.length];
    card.style.borderTop = `8px solid ${getColorValue(nextColor)}`;
    const taskIdx = taskArr.findIndex(t => t.id === id);
    taskArr[taskIdx].color = nextColor;
    updateLocalStorage();
    if (activeFilterColor) {
      activeFilterColor === "all" ? showAllCards() : filterCardsByColor(activeFilterColor);
    }
  });
}

function handleDelete(card, id) {
  card.addEventListener("click", () => {
    if (!deleteMode) return;
    card.remove();
    taskArr = taskArr.filter(t => t.id !== id);
    updateLocalStorage();
  });
}

function updateLocalStorage() {
  localStorage.setItem("allTasks", JSON.stringify(taskArr));
}

window.addEventListener("DOMContentLoaded", () => {
  taskArr.forEach(task => taskCreated(task.name, task.id, task.color));
});
