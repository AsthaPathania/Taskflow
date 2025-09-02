// 📝 Saari tasks ko ek array me store karenge
let tasks = [];

// ---- DOM elements ko pakad rahe hain ----
const taskTitle = document.getElementById("taskTitle");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Stats ke liye spans
const statTotal = document.getElementById("stat-total");
const statDone = document.getElementById("stat-done");
const statPending = document.getElementById("stat-pending");
const statFrog = document.getElementById("stat-frog");

// Extra buttons (agar HTML me ho to unhe pakadenge)
const clearAllBtn = document.getElementById("clearAllBtn");
const markFrogBtn = document.getElementById("markFrogBtn");
const markDoneBtn = document.getElementById("markDoneBtn");

// =======================
// ➕ Task Add karna
// =======================
addTaskBtn.addEventListener("click", () => {
  // Agar title khali hai to alert dikhana
  if (taskTitle.value.trim() === "") {
    alert("Task title likho!");
    return;
  }

  // Naya task object banaya
  let newTask = {
    id: Date.now(),              // unique id (current timestamp)
    title: taskTitle.value,      // task ka naam
    priority: taskPriority.value,// priority dropdown se
    date: taskDate.value,        // date input se
    time: taskTime.value,        // time input se
    completed: false             // default completed = false
  };

  tasks.push(newTask);  // array me add kar diya
  renderTasks();        // screen par dikhana
  clearInputs();        // input fields reset
});

// =======================
// 🧹 Inputs clear karna
// =======================
function clearInputs() {
  taskTitle.value = "";
  taskDate.value = "";
  taskTime.value = "";
}

// =======================
// 🎨 Tasks render karna
// =======================
function renderTasks(filter = "all") {
  // Sabse pehle purani task list empty
  taskList.innerHTML = "";

  // Default filter = all tasks
  let filtered = tasks;

  // Filter ke hisaab se tasks nikaalna
  if (filter === "pending") {
    filtered = tasks.filter(t => !t.completed);
  } else if (filter === "completed") {
    filtered = tasks.filter(t => t.completed);
  } else if (filter === "frog") {
    filtered = tasks.filter(t => t.priority === "Frog");
  } else if (filter === "morning") {
    filtered = tasks.filter(t => t.time && parseInt(t.time.split(":")[0]) < 12);
  } else if (filter === "afternoon") {
    filtered = tasks.filter(t => {
      if (!t.time) return false;
      let h = parseInt(t.time.split(":")[0]);
      return h >= 12 && h < 17;
    });
  } else if (filter === "evening") {
    filtered = tasks.filter(t => {
      if (!t.time) return false;
      let h = parseInt(t.time.split(":")[0]);
      return h >= 17;
    });
  }

  // --------------------------
  // 📝 Main task list
  // --------------------------
  filtered.forEach(task => {
    let li = document.createElement("li");
    li.className = "task-item " + (task.completed ? "completed" : "");
    li.innerHTML = `
      <span>${task.title} (${task.priority}) - ${task.date || ""} ${task.time || ""}</span>
      <div>
        <button class="btn small" onclick="toggleTask(${task.id})">${task.completed ? "Undo" : "Done"}</button>
        <button class="btn ghost small" onclick="deleteTask(${task.id})">Delete</button>
        <button class="btn warning small" onclick="markFrog(${task.id})">🐸 Frog</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  // --------------------------
  // 🌞 Schedule slots (Morning, Afternoon, Evening)
  // --------------------------
  const morningSlot = document.getElementById("slot-morning");
  const afternoonSlot = document.getElementById("slot-afternoon");
  const eveningSlot = document.getElementById("slot-evening");

  // Pehle purane schedule ko empty karo
  morningSlot.innerHTML = "";
  afternoonSlot.innerHTML = "";
  eveningSlot.innerHTML = "";

  // Saari tasks ko unke time ke hisaab se schedule me daalo
  tasks.forEach(task => {
    if (!task.time) return; // time hi nahi to skip
    let h = parseInt(task.time.split(":")[0]); // hour nikala

    let li = document.createElement("li");
    li.textContent = `${task.title} (${task.priority}) - ${task.time}`;

    if (h < 12) {
      morningSlot.appendChild(li);     // morning slot me daala
    } else if (h >= 12 && h < 17) {
      afternoonSlot.appendChild(li);   // afternoon slot me daala
    } else {
      eveningSlot.appendChild(li);     // evening slot me daala
    }
  });

  // 📊 Stats update karna
  updateStats();
}

// =======================
// ✅ Task toggle (Done/Undo)
// =======================
function toggleTask(id) {
  let task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  renderTasks(document.querySelector(".chip.active").dataset.filter);
}

// =======================
// ❌ Task delete karna
// =======================
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks(document.querySelector(".chip.active").dataset.filter);
}

// =======================
// 🐸 Task ko Frog mark karna
// =======================
function markFrog(id) {
  let task = tasks.find(t => t.id === id);
  if (task) task.priority = "Frog";
  renderTasks(document.querySelector(".chip.active").dataset.filter);
}

// =======================
// ✅ Task ko Done mark karna
// =======================
function markDone(id) {
  let task = tasks.find(t => t.id === id);
  if (task) task.completed = true;
  renderTasks(document.querySelector(".chip.active").dataset.filter);
}

// =======================
// 🧹 Saari tasks clear karna
// =======================
function clearAll() {
  if (confirm("Kya aap sabhi tasks clear karna chahte ho?")) {
    tasks = [];
    renderTasks();
  }
}

// =======================
// 📊 Stats update karna
// =======================
function updateStats() {
  statTotal.textContent = tasks.length;
  statDone.textContent = tasks.filter(t => t.completed).length;
  statPending.textContent = tasks.filter(t => !t.completed).length;
  statFrog.textContent = tasks.filter(t => t.priority === "Frog").length;
}

// =======================
// 🎛 Filters ke liye chip buttons
// =======================
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    renderTasks(chip.dataset.filter);
  });
});

// =======================
// 🖱 Extra buttons events (agar exist karte ho to)
// =======================
if (clearAllBtn) clearAllBtn.addEventListener("click", clearAll);

// =======================
// 📌 Page load hote hi render call
// =======================
renderTasks();

// =======================
// 🌍 Functions ko window object me attach karna
// =======================
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.markFrog = markFrog;
window.markDone = markDone;
window.clearAll = clearAll;

// Logout button
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  // ✅ Clear any user session data (if stored)
  localStorage.removeItem("loggedInUser"); // Example: if you store username
  sessionStorage.clear(); // Clear session storage

  // ✅ Redirect to login page
  window.location.href = "login.html";
});
