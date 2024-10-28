document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoList = document.getElementById('todo-list');
    const filters = document.querySelectorAll('.filter-btn');
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let filterStatus = 'all';
    let draggingIndex = null;

    const renderTodos = () => {
        todoList.innerHTML = '';
        const filteredTodos = todos.filter(todo => {
            if (filterStatus === 'all') return true;
            if (filterStatus === 'active') return !todo.completed;
            if (filterStatus === 'completed') return todo.completed;
        });

        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.classList.add('todo-item');
            li.draggable = true;
            li.innerHTML = `
                <span class="todo-text ${todo.completed ? 'completed' : 'new-task'}">
                    <span class="text-content">${todo.text}</span>
                    <input type="text" value="${todo.text}" class="editing-mode ${todo.completed ? '' : 'new-task'}" style="display: none;">
                </span>
                <div class="button-container">
                    <button class="complete-btn">${todo.completed ? '↺' : '✔'}</button>
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">❌</button>
                    <span class="drag-handle">⇅</span>
                </div>
            `;
            todoList.appendChild(li);

            li.addEventListener('dragstart', (e) => {
                draggingIndex = todos.indexOf(todo);
                li.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', draggingIndex);
            });

            li.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            li.addEventListener('drop', (e) => {
                e.preventDefault();
                const toIndex = todos.indexOf(todo);

                if (draggingIndex !== toIndex) {
                    const [movedTodo] = todos.splice(draggingIndex, 1);
                    todos.splice(toIndex, 0, movedTodo);
                    saveAndRender();
                }
            });

            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
                draggingIndex = null;
            });

            li.querySelector('.complete-btn').addEventListener('click', () => {
                todos[index].completed = !todos[index].completed;
                saveAndRender();
            });

            li.querySelector('.delete-btn').addEventListener('click', () => {
                li.classList.add('deleting'); // Add fade-out class
                setTimeout(() => {
                    todos.splice(index, 1); // Remove the task from the array
                    saveAndRender(); // Refresh the displayed tasks
                }, 300); // Time matches the CSS transition duration
            });

            const editButton = li.querySelector('.edit-btn');
            const textContent = li.querySelector('.text-content');
            const inputField = li.querySelector('.editing-mode');

            editButton.addEventListener('click', () => {
                toggleEditMode(inputField, textContent, index);
            });

            inputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    toggleEditMode(inputField, textContent, index);
                }
            });
        });
    };

    const toggleEditMode = (inputField, textContent, index) => {
        if (inputField.style.display === 'none') {
            inputField.style.display = 'block';
            textContent.style.display = 'none';
            inputField.classList.add('new-task');
            inputField.focus();
            const length = inputField.value.length;
            inputField.setSelectionRange(length, length);
        } else {
            todos[index].text = inputField.value;
            inputField.style.display = 'none';
            textContent.style.display = 'block';
            saveAndRender();
        }
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
