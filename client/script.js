document.addEventListener("DOMContentLoaded", () => {
  // Element references
  const addBtn = document.getElementById("add-btn");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const totalTasks = document.getElementById("total-tasks");
  const completedTasks = document.getElementById("completed-tasks");
  const uncompletedTasks = document.getElementById("uncompleted-tasks");
  const filterByDone = document.getElementById("filter-by-done");
  const token = sessionStorage.getItem("token");

  // Toggle dark mode
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode")
    );
  });

  // Load dark mode state from localStorage
  if (JSON.parse(localStorage.getItem("darkMode"))) {
    document.body.classList.add("dark-mode");
  }

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Load todos from the database
  async function loadTodos() {
    try {
      const response = await fetch("http://localhost:3000/api/todos", {
        headers,
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch todos: ${response.statusText}`);
      }
      const todos = await response.json();
      todos.forEach((todo) => {
        const newTodoItem = createTodoItem(
          todo.text,
          todo.checked,
          todo.category,
          todo.tags,
          todo.dueDate,
          todo.priority,
          todo._id
        );
        todoList.appendChild(newTodoItem);
      });
      updateTaskCounts();
      filterTodos();
    } catch (error) {
      console.error(error.message);
      alert("An error occurred while fetching todos. Please try again later.");
    }
  }

  // Save a new todo to the database
  async function saveTodoToDB(todo) {
    try {
      const response = await fetch("http://localhost:3000/api/todos", {
        method: "POST",
        headers,
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error(`Failed to save todo: ${response.statusText}`);
      }
      const savedTodo = await response.json();
      return savedTodo;
    } catch (error) {
      console.error(error.message);
      alert("An error occurred while saving the todo. Please try again later.");
    }
  }

  // Update a todo in the database
  async function updateTodoInDB(id, updatedFields) {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedFields),
      });
      if (!response.ok) {
        throw new Error(`Failed to update todo: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error.message);
      alert(
        "An error occurred while updating the todo. Please try again later."
      );
    }
  }

  // Delete a todo from the database
  async function deleteTodoItemFromDB(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) {
        throw new Error(`Failed to delete todo: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error.message);
      alert(
        "An error occurred while deleting the todo. Please try again later."
      );
    }
  }

  // Create a new todo item
  function createTodoItem(
    text,
    checked = false,
    category = "Other",
    tags = [],
    dueDate = new Date().toISOString(),
    priority = "Medium",
    id = null
  ) {
    const li = document.createElement("li");
    if (checked) {
      li.classList.add("checked");
    }

    const formattedDate = dueDate ? new Date(dueDate).toLocaleString() : "";

    li.innerHTML = `
      <input type="checkbox" class="complete-checkbox" ${
        checked ? "checked" : ""
      }>
      <span class="font-text todo-text">${text}</span>
      <span class="font todo-category">${category}</span>
      <span class="font todo-tags">${tags.join(", ")}</span>
      <span class="font todo-due-date">${formattedDate}</span>
      <span class="font todo-priority">${priority}</span>
      <input type="text" class="edit-input" value="${text}" />
      <div class="icons">
        <i class="fa-solid fa-pen-to-square edit-icon"></i>
        <i class="fa-solid fa-trash delete-icon"></i>
      </div>
    `;
    li.dataset.id = id;
    addEventListenersToIcons(li);
    return li;
  }

  // Add event listeners to the edit and delete icons
  function addEventListenersToIcons(li) {
    const editIcon = li.querySelector(".edit-icon");
    const deleteIcon = li.querySelector(".delete-icon");
    const editInput = li.querySelector(".edit-input");
    const todoText = li.querySelector(".todo-text");
    const completeCheckbox = li.querySelector(".complete-checkbox");

    // Edit todo
    editIcon.addEventListener("click", () => {
      li.classList.add("editing");
      editInput.focus();
    });

    // Save edited todo
    editInput.addEventListener("blur", () => {
      const newText = editInput.value.trim();
      if (newText) {
        todoText.textContent = newText;
        li.classList.remove("editing");
        saveTodos();
      }
    });

    // Save edited todo on pressing Enter
    editInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        editInput.blur();
      }
    });

    // Delete todo
    deleteIcon.addEventListener("click", () => {
      deleteTodoItem(li);
      saveTodos();
    });

    // Mark todo as complete/incomplete
    completeCheckbox.addEventListener("change", () => {
      li.classList.toggle("checked", completeCheckbox.checked);
      saveTodos();
    });

    // Toggle todo complete status on clicking anywhere on the li
    li.addEventListener("click", (event) => {
      if (
        event.target === editIcon ||
        event.target === deleteIcon ||
        event.target === editInput ||
        event.target === completeCheckbox
      )
        return;
      li.classList.toggle("checked");
      completeCheckbox.checked = li.classList.contains("checked");
      saveTodos();
    });
  }

  // Save todos to the database
  function saveTodos() {
    todoList.querySelectorAll("li").forEach((li) => {
      const id = li.dataset.id;
      const updatedFields = {
        text: li.querySelector(".todo-text").textContent,
        checked: li.classList.contains("checked"),
        category: li.querySelector(".todo-category").textContent,
        tags: li.querySelector(".todo-tags").textContent.split(", "),
        dueDate: new Date(
          li.querySelector(".todo-due-date").textContent
        ).toISOString(),
        priority: li.querySelector(".todo-priority").textContent,
      };
      updateTodoInDB(id, updatedFields);
    });
    updateTaskCounts();
  }

  // Delete a todo item
  async function deleteTodoItem(li) {
    const id = li.dataset.id;
    await deleteTodoItemFromDB(id);
    li.remove();
    updateTaskCounts();
  }

  async function addNewTodo() {
    const text = todoInput.value.trim();
    const category = document.getElementById("category-select").value;
    const tags = document.getElementById("tags-input").value.trim().split(",");

    const dueDateInputDate = document.getElementById(
      "due-date-input-date"
    ).value;
    const dueDateInputTime = document.getElementById(
      "due-date-input-time"
    ).value;
    let dueDate;

    if (dueDateInputDate) {
      if (dueDateInputTime) {
        dueDate = new Date(
          `${dueDateInputDate}T${dueDateInputTime}:00`
        ).toISOString();
      } else {
        dueDate = new Date(`${dueDateInputDate}T00:00:00`).toISOString();
      }
    } else {
      dueDate = new Date().toISOString();
    }

    const priority = document.getElementById("priority-select").value;

    if (text) {
      const newTodo = await saveTodoToDB({
        text,
        category,
        tags,
        dueDate,
        priority,
        userId: "yourUserIdHere", // replace with actual user ID
      });
      if (newTodo) {
        const newTodoItem = createTodoItem(
          newTodo.text,
          newTodo.checked,
          newTodo.category,
          newTodo.tags,
          newTodo.dueDate,
          newTodo.priority,
          newTodo._id
        );
        todoList.appendChild(newTodoItem);
        todoInput.value = "";
        document.getElementById("tags-input").value = "";
        document.getElementById("due-date-input-date").value = "";
        document.getElementById("due-date-input-time").value = "";
        updateTaskCounts();
      }
    }
  }

  // Update task counts
  function updateTaskCounts() {
    const total = todoList.querySelectorAll("li").length;
    const completed = todoList.querySelectorAll("li.checked").length;
    const uncompleted = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    uncompletedTasks.textContent = uncompleted;
  }

  // Filter todos based on various criteria
  function filterTodos() {
    const searchKeyword = document
      .getElementById("search-input")
      .value.toLowerCase();
    const filterCategory = document.getElementById("filter-category").value;
    const filterPriority = document.getElementById("filter-priority").value;
    const filterDueDate = document.getElementById("filter-due-date").value;
    const filterStatus = filterByDone.value;

    const todoItems = todoList.querySelectorAll("li");
    todoItems.forEach((li) => {
      const text = li.querySelector(".todo-text").textContent.toLowerCase();
      const category = li.querySelector(".todo-category").textContent;
      const priority = li.querySelector(".todo-priority").textContent;
      const dueDateText = li.querySelector(".todo-due-date").textContent;
      const dueDate = new Date(dueDateText);
      const isChecked = li.classList.contains("checked");

      const matchesSearch = text.includes(searchKeyword);
      const matchesCategory =
        filterCategory === "All" || category === filterCategory;
      const matchesPriority =
        filterPriority === "All" || priority === filterPriority;

      let matchesDueDate = true;
      const today = new Date();
      if (filterDueDate === "Overdue") {
        matchesDueDate = dueDate < today;
      } else if (filterDueDate === "Today") {
        matchesDueDate = dueDate.toDateString() === today.toDateString();
      } else if (filterDueDate === "This Week") {
        const startOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay())
        );
        const endOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay() + 6)
        );
        matchesDueDate = dueDate >= startOfWeek && dueDate <= endOfWeek;
      } else if (filterDueDate === "Future") {
        matchesDueDate = dueDate > today;
      }

      const matchesStatus =
        filterStatus === "All Tasks" ||
        (filterStatus === "Completed" && isChecked) ||
        (filterStatus === "Uncompleted" && !isChecked);

      const shouldShow =
        matchesSearch &&
        matchesCategory &&
        matchesPriority &&
        matchesDueDate &&
        matchesStatus;

      li.style.display = shouldShow ? "flex" : "none";
    });
  }

  document.getElementById("logout-button").addEventListener("click", () => {
    // Remove the token from local storage or session storage
    localStorage.removeItem("token");
    // Redirect to login page
    window.location.href = "login.html";
  });

  // Event listeners for filter inputs
  document
    .getElementById("search-input")
    .addEventListener("input", filterTodos);
  document
    .getElementById("filter-category")
    .addEventListener("change", filterTodos);
  document
    .getElementById("filter-priority")
    .addEventListener("change", filterTodos);
  document
    .getElementById("filter-due-date")
    .addEventListener("change", filterTodos);
  filterByDone.addEventListener("change", filterTodos);

  // Event listener for adding new todo
  addBtn.addEventListener("click", addNewTodo);

  // Load todos on page load
  loadTodos();
});
