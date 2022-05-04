"use strict";

const form = document.querySelector(".form");
const input = document.querySelector(".input");
const todoContainer = document.querySelector(".draggable-list");
const todoCounter = document.querySelector(".todo-counter");
const activeFilter = document.querySelector(".active");
const completedFilter = document.querySelector(".Completed");
const allFilter = document.querySelector(".all");
const clearCompletedFilter = document.querySelector(".todo-clearer");
const toggleBtn = document.querySelector(".toggle img");
const header = document.querySelector(".header");
const body = document.body;
const todoFilter = document.querySelector(".todo-box-filter");
const filter = document.querySelectorAll(".filter");
const sorters = document.querySelector(".sorters");
const btnAdd = document.querySelector(".btn-add");

let inputValue;
let taskArr = [];
input.focus();
let mode = "dark";
let dragStartIndex;

const init = function () {
  input.classList.add(`${mode}--mode-input`);
  body.classList.add(`${mode}--mode-body`);
  todoFilter.classList.add(`${mode}--mode-todo-box-filter`);
  header.style.backgroundImage = `url(./images/bg-desktop-${mode}.jpg)`;
  filter.forEach((e) => e.classList.add(`${mode}--mode-filter`));
  toggleBtn.setAttribute("src", `images/icon-${mode}.svg`);
  sorters.classList.add(`${mode}--sorters`);
};
init();

const html = function (inputValue) {
  return `
    <div class="draggable todo-box ${mode}--mode-todo-box" draggable='true'>
      <div class="task_left">
          <input class='checkbox' type="checkbox" id="task" name="task" value="task" />
          <span class='taskText'>${inputValue}</span>
      </div>
      <div class="task_close hidden">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
      </div>
    </div>
  `;
};

const generateNewTask = function (e) {
  e.preventDefault();
  inputValue = document.querySelector(".input").value;
  if (inputValue === "") return;
  updateTasks(inputValue);
};

const updateTasks = function (arr) {
  todoContainer.insertAdjacentHTML("afterbegin", html(arr));
  taskArr.push(arr);
  input.value = "";

  //variables of all elements in the todoBox
  const items = Array.from(document.querySelectorAll(".todo-box"));
  const checkbox = document.querySelector(".checkbox");
  const closeBtn = document.querySelector(".task_close");

  //reveals the close btn on hover
  items.forEach((el) => {
    el.addEventListener("mouseover", () => {
      el.lastElementChild.classList.remove("hidden");
    });
  });

  //setting attributes to items
  items.forEach((item, index) => {
    item.setAttribute("data-index", index);
  });

  //removes the task when chacked completed
  checkbox.addEventListener("change", (e) => {
    if (!e.target.checked) return;
    e.target.nextElementSibling.style.textDecoration = "line-through";
    e.target.closest(".todo-box").classList.add("checked");

    closeBtn.addEventListener("click", (el) => {
      closeBtn.closest(".todo-box").remove();
      const item = Array.from(document.querySelectorAll(".todo-box"));
      taskCounter(item);
    });
  });

  //updates the number of tasks
  taskCounter(items);

  //allBtn
  allBtn(items);

  //activebtn
  activeBtn(items);

  //completedBtn
  completedBtn(items);

  //clearCompleted
  clearCompleted(items);

  //addEventListeners
  addEventListeners();

  //setLocalStorage
  localStorage.setItem("task", taskArr);
};

//this updates the number of tasks on the UI using the number of inputed tasks
const taskCounter = function (taskArr) {
  const counterText = `${
    taskArr.length === 1
      ? `${taskArr.length} item left`
      : `${taskArr.length} items left`
  }`;
  todoCounter.innerHTML = counterText;
};

//a helper function responsilbe for removing the class of hidden
const removeHiddenHelper = function (items) {
  items.forEach((e) => {
    e.classList.remove("hidden");
  });
};

//handler for the all button
const allBtn = function (items) {
  allFilter.addEventListener("click", () => {
    removeHiddenHelper(items);
  });
};

//handler for the active button
const activeBtn = function (items) {
  activeFilter.addEventListener("click", () => {
    removeHiddenHelper(items);

    const activeElements = items.filter((el) =>
      el.classList.contains("checked")
    );
    if (!activeElements) return;
    activeElements.forEach((e) => e.classList.add("hidden"));
  });
};

//handler for the completed button
const completedBtn = function (items) {
  completedFilter.addEventListener("click", () => {
    removeHiddenHelper(items);
    const completedElements = items.filter(
      (el) => !el.classList.contains("checked")
    );
    completedElements.forEach((e) => e.classList.add("hidden"));
  });
};

//handler for the clear completed button
const clearCompleted = function (items) {
  clearCompletedFilter.addEventListener("click", () => {
    removeHiddenHelper(items);
    const completedElements = items.filter((el) =>
      el.classList.contains("checked")
    );
    completedElements[0].remove();
    const item = Array.from(document.querySelectorAll(".todo-box"));
    taskCounter(item);
  });
};

//drag and drop functionality
const dragStart = function () {
  dragStartIndex = +this.closest("div").getAttribute("data-index");
};
const dragEnter = function () {
  this.classList.add("over");
};
const dragLeave = function () {
  this.classList.remove("over");
};
const dragOver = function (e) {
  e.preventDefault();
};
const dragDrop = function () {
  const dragEndIndex = +this.getAttribute("data-index");
  swapItems(dragStartIndex, dragEndIndex);

  this.classList.remove("over");
};

function swapItems(fromIndex, toIndex) {
  const item = document.querySelectorAll(".todo-box");

  const taskOne = item[fromIndex];
  const taskTwo = item[toIndex];

  item[fromIndex].insertAdjacentElement("afterend", taskTwo);
  item[toIndex].insertAdjacentElement("afterend", taskOne);
}

const addEventListeners = function () {
  const draggables = document.querySelectorAll(".draggable");
  const dragListItems = document.querySelectorAll(".draggable-list div");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
  });
  dragListItems.forEach((item) => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });
};

["click", "submit"].forEach((e) => {
  form.addEventListener(e, generateNewTask);
});

//Rendering previous tasks
window.addEventListener("load", () => {
  const tasks = localStorage.getItem("task").split(",");
  tasks.forEach((e) => {
    updateTasks(e);
  });
});

//swiching modes
toggleBtn.addEventListener("click", () => {
  const todo = Array.from(document.querySelectorAll(".todo-box"));
  todo.forEach((e) => e.classList.add(`${mode}--mode-todo-box`));

  mode = mode === "dark" ? "light" : "dark";
  document.body.dataset.mode = mode;
  init();
  todo.forEach((e) => e.classList.add(`${mode}--mode-todo-box`));

  const switchMode = function (mode) {
    input.classList.remove(`${mode}--mode-input`);
    body.classList.remove(`${mode}--mode-body`);
    todo.forEach((e) => e.classList.remove(`${mode}--mode-todo-box`));
    todoFilter.classList.remove(`${mode}--mode-todo-box-filter`);
    filter.forEach((e) => e.classList.remove(`${mode}--mode-filter`));
    sorters.classList.remove(`${mode}--sorters`);
  };

  if (document.body.dataset.mode === "dark") {
    input.focus();
    switchMode("light");
  }

  if (document.body.dataset.mode === "light") {
    input.focus();
    switchMode("dark");
  }
});
