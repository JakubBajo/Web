document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoList = document.getElementById('todo-list');
    const filters = document.querySelectorAll('.filter-btn');
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let filterStatus = 'all';

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
            li.innerHTML = `
                <span class="todo-text ${todo.completed ? 'completed' : 'active'}">${todo.text}</span>
                <div>
                    <button class="complete-btn">${todo.completed ? 'Undo' : 'Complete'}</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            todoList.appendChild(li);

            // Označenie ako dokončené/undo
            li.querySelector('.complete-btn').addEventListener('click', () => {
                todos[index].completed = !todos[index].completed;
                saveAndRender();
            });

            // Odstránenie úlohy
            li.querySelector('.delete-btn').addEventListener('click', () => {
                li.classList.add('deleting'); // Animation class
                setTimeout(() => {
                    todos.splice(index, 1);
                    saveAndRender();
                }, 300); // Delay for animation
            });

            // Úprava úlohy
            li.querySelector('.edit-btn').addEventListener('click', () => {
                const span = li.querySelector('.todo-text');
                const input = document.createElement('input');
                input.type = 'text';
                input.value = span.textContent;
                span.replaceWith(input);
                input.focus();

                // Keď používateľ stlačí Enter alebo klikne mimo
                input.addEventListener('blur', () => {
                    todos[index].text = input.value;
                    saveAndRender();
                });

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        todos[index].text = input.value;
                        saveAndRender();
                    }
                });
            });
        });
    };

    const saveAndRender = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    };

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = document.getElementById('new-task').value;
        if (newTask) {
            todos.push({ text: newTask, completed: false });
            saveAndRender();
            todoForm.reset();
        }
    });

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterStatus = btn.dataset.filter;
            renderTodos();
        });
    });

    renderTodos();
});

