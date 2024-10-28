document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoList = document.getElementById('todo-list');
    const filters = document.querySelectorAll('.filter-btn');
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let filterStatus = 'all';
    let draggingIndex = null; // Track the index of the dragged item

    const renderTodos = () => {
        todoList.innerHTML = '';
        const filteredTodos = todos.filter(todo => {
            if (filterStatus === 'all') return true;
            if (filterStatus === 'active') return !todo.completed;
            if (filterStatus === 'completed') return todo.completed;
        });

        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.classList.add('todo-item'); // Class for animation
            li.draggable = true; // Make the list item draggable
            li.innerHTML = `
                <span class="todo-text ${todo.completed ? 'completed' : 'active'}">${todo.text}</span>
                <div class="button-container">
                    <button class="complete-btn">${todo.completed ? '↺' : '✔'}</button>
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">❌</button>
                    <span class="drag-handle">⇅</span>
                </div>
            `;
            todoList.appendChild(li);

            // Drag-and-Drop functionality
            li.addEventListener('dragstart', (e) => {
                draggingIndex = index; // Store the index of the dragged item
                li.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', draggingIndex); // Store index of the dragged item
            });

            li.addEventListener('dragover', (e) => {
                e.preventDefault(); // Allow drop
            });

            li.addEventListener('drop', (e) => {
                e.preventDefault();
                const toIndex = index;

                if (draggingIndex !== toIndex) {
                    // Move the task in the todos array
                    const [movedTodo] = todos.splice(draggingIndex, 1);
                    todos.splice(toIndex, 0, movedTodo);
                    saveAndRender();
                }
            });

            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
                draggingIndex = null; // Reset dragging index
            });

            // Mark as complete/undo
            li.querySelector('.complete-btn').addEventListener('click', () => {
                todos[index].completed = !todos[index].completed;
                saveAndRender();
            });

            // Remove task
            li.querySelector('.delete-btn').addEventListener('click', () => {
                li.classList.add('deleting'); // Animation class
                setTimeout(() => {
                    todos.splice(index, 1);
                    saveAndRender();
                }, 300); // Delay for animation
            });

            // Edit task
            li.querySelector('.edit-btn').addEventListener('click', () => {
                const span = li.querySelector('.todo-text');
                const newTask = prompt('Edit your task:', span.textContent);
                if (newTask) {
                    todos[index].text = newTask;
                    saveAndRender();
                }
            });
        });
    };

    const saveAndRender = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    };

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTaskInput = document.getElementById('new-task');
        todos.push({ text: newTaskInput.value, completed: false });
        newTaskInput.value = '';
        saveAndRender();
    });

    filters.forEach(button => {
        button.addEventListener('click', () => {
            filterStatus = button.dataset.filter;
            filters.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTodos();
        });
    });

    renderTodos();
});
