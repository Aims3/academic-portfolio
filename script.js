document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-open');
            const isOpen = navMenu.classList.contains('is-open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });
    }
});

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

let myTasks = [];

if (addTaskBtn) {
    addTaskBtn.addEventListener('click', function () {
        const taskValue = taskInput.value.trim();
        if (taskValue !== "") {
            addNewTask(taskValue);
            taskInput.value = "";
        } else {
            alert("Please enter a task first!");
        }
    });
}

function addNewTask(taskText) {
    const task = {
        name: taskText,
        isCompleted: false
    };
    myTasks.push(task);
    renderTasks();
}

function renderTasks() {
    if (!taskList) return;
    taskList.innerHTML = "";
    for (let i = 0; i < myTasks.length; i++) {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (myTasks[i].isCompleted === true) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <span class="task-text">${myTasks[i].name}</span>
            <div class="task-actions">
                <button class="icon-btn complete-btn" onclick="toggleTask(${i})" title="Mark Complete">
                    <i class="fas fa-check-circle"></i>
                </button>
                <button class="icon-btn delete-btn" onclick="deleteTask(${i})" title="Delete Task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    }
}

function toggleTask(index) {
    myTasks[index].isCompleted = !myTasks[index].isCompleted;
    renderTasks();
}

function deleteTask(index) {
    myTasks.splice(index, 1);
    renderTasks();
}

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            if (formStatus) {
                formStatus.className = 'form-status';
                formStatus.innerText = '';
            }

            if (name === '' || email === '' || phone === '' || message === '') {
                showError("Error: All fields are required.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError("Error: Please enter a valid email address.");
                return;
            }

            const phoneRegex = /^\d+$/;
            if (!phoneRegex.test(phone)) {
                showError("Error: Phone number must contain only numbers (no spaces or letters).");
                return;
            }

            showSuccess("Success! Your message has been validated and sent.");
            contactForm.reset();
        });
    }

    function showError(message) {
        if (formStatus) {
            formStatus.innerText = message;
            formStatus.classList.add('status-error');
        }
    }

    function showSuccess(message) {
        if (formStatus) {
            formStatus.innerText = message;
            formStatus.classList.add('status-success');
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById("todo-form");
    const taskDescInput = document.getElementById("task-desc");
    const taskCategorySelect = document.getElementById("task-category");
    const taskPrioritySelect = document.getElementById("task-priority");
    const taskDateInput = document.getElementById("task-date");
    const taskListElement = document.getElementById("task-list");
    
    const statTotal = document.getElementById("stat-total");
    const statCompleted = document.getElementById("stat-completed");
    const statRemaining = document.getElementById("stat-remaining");
    const progressFill = document.getElementById("stat-progress-fill");
    const headerCounter = document.getElementById("header-counter");
    
    const clearDoneBtn = document.getElementById("clear-done-btn");
    const filterPills = document.querySelectorAll(".filter-pill");

    let tasks = JSON.parse(localStorage.getItem("academic_tasks")) || [];
    let activeFilter = "All";

    function renderAcademicTasks() {
        if (!taskListElement) return;
        taskListElement.innerHTML = "";
        
        const filteredTasks = tasks.filter(task => {
            const filterLower = activeFilter.toLowerCase();
            if (filterLower === "all") return true;
            if (filterLower === "active") return !task.completed;
            if (filterLower === "completed") return task.completed;
            return task.category.toLowerCase() === filterLower;
        });

        filteredTasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.className = `task-card-item ${task.completed ? 'completed-state' : ''}`;
            
            let dateBadge = task.dueDate ? `<span class="meta-badge">📅 ${task.dueDate}</span>` : "";
            let priorityLabel = task.priority === "High" ? "🔴 High" : task.priority === "Medium" ? "🟡 Medium" : "🟢 Low";
            
            taskItem.innerHTML = `
                <div class="task-left-info">
                    <div class="task-checkbox" data-id="${task.id}"></div>
                    <div>
                        <span class="task-title-text">${task.text}</span>
                        <div class="task-meta-pills">
                            <span class="meta-badge">${task.category}</span>
                            <span class="meta-badge">${priorityLabel}</span>
                            ${dateBadge}
                        </div>
                    </div>
                </div>
                <button class="task-delete-trigger" data-id="${task.id}"><i class="fas fa-trash-alt"></i></button>
            `;

            taskItem.querySelector(".task-checkbox").addEventListener("click", () => {
                toggleAcademicTaskComplete(task.id);
            });

            taskItem.querySelector(".task-delete-trigger").addEventListener("click", () => {
                deleteAcademicTask(task.id);
            });

            taskListElement.appendChild(taskItem);
        });

        updateDashboardCounters();
    }

    function updateDashboardCounters() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const remaining = total - completed;
        const percent = total > 0 ? (completed / total) * 100 : 0;

        if (statTotal) statTotal.textContent = total;
        if (statCompleted) statCompleted.textContent = completed;
        if (statRemaining) statRemaining.textContent = remaining;
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (headerCounter) headerCounter.textContent = `${completed}/${total} completed`;

        localStorage.setItem("academic_tasks", JSON.stringify(tasks));
    }

    function addAcademicTask(e) {
        e.preventDefault();

        const newTask = {
            id: Date.now(),
            text: taskDescInput.value.trim(),
            category: taskCategorySelect.value,
            priority: taskPrioritySelect.value,
            dueDate: taskDateInput.value || null,
            completed: false
        };

        tasks.push(newTask);
        if (todoForm) todoForm.reset();
        renderAcademicTasks();
    }

    function toggleAcademicTaskComplete(id) {
        tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        renderAcademicTasks();
    }

    function deleteAcademicTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        renderAcademicTasks();
    }

    if (clearDoneBtn) {
        clearDoneBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => !t.completed);
            renderAcademicTasks();
        });
    }

    filterPills.forEach(pill => {
        pill.addEventListener("click", (e) => {
            filterPills.forEach(p => p.classList.remove("active"));
            e.target.classList.add("active");
            activeFilter = e.target.getAttribute("data-filter") || e.target.textContent.trim();
            renderAcademicTasks();
        });
    });

    if (todoForm) {
        todoForm.addEventListener("submit", addAcademicTask);
    }
    
    renderAcademicTasks();
});