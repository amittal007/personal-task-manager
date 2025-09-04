// frontend/js/ui.js

const ui = {
    // Selectors for DOM elements
    selectors: {
        taskList: document.getElementById('task-list-body'),
        taskForm: document.getElementById('task-form'),
        formTitle: document.getElementById('form-title'),
        taskTitleInput: document.getElementById('task-title'),
        taskDescInput: document.getElementById('task-description'),
        taskDueDateInput: document.getElementById('task-due-date'),
        taskStatusInput: document.getElementById('task-status'),
        taskIdInput: document.getElementById('task-id'),
        formModal: document.getElementById('task-modal'),
        newTaskButton: document.getElementById('new-task-btn'),
        cancelButton: document.getElementById('cancel-btn'),
    },

    // Initialize the Semantic UI modal
    initModal: () => {
        // Using vanilla JS to control the modal visibility
        ui.selectors.newTaskButton.addEventListener('click', () => {
            ui.prepareForm(); // Prepare form for a new task
        });

        ui.selectors.cancelButton.addEventListener('click', () => {
            ui.hideModal();
        });
    },
    
    // Show the modal
    showModal: () => {
        ui.selectors.formModal.classList.add('active');
    },

    // Hide the modal
    hideModal: () => {
        ui.selectors.formModal.classList.remove('active');
    },
    
    // Render all tasks in the table
    renderTasks: (tasks) => {
        const { taskList } = ui.selectors;
        taskList.innerHTML = ''; // Clear existing tasks

        if (tasks.length === 0) {
            taskList.innerHTML = '<tr><td colspan="5" style="text-align:center;">No tasks yet. Add one!</td></tr>';
            return;
        }

        tasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.dataset.id = task.TaskID;
            if (task.Status === 'Completed') {
                tr.classList.add('completed-task');
            }

            // Format dates for better readability
            const createdAt = new Date(task.CreatedAt).toLocaleDateString();
            const dueDate = new Date(task.DueDate).toLocaleDateString();
            
            // The `data-label` attribute is crucial for the mobile view
            tr.innerHTML = `
                <td data-label="Status">
                    <span class="ui ${task.Status === 'Completed' ? 'green' : 'grey'} label">${task.Status}</span>
                </td>
                <td data-label="Task">
                    <div class="task-heading">${task.TaskHeading}</div>
                    <div class="task-description">${task.TaskDescription}</div>
                </td>
                <td data-label="Due Date">${dueDate}</td>
                <td data-label="Created">${createdAt}</td>
                <td class="actions-cell">
                    <button class="ui mini green icon button complete-btn" title="Mark as Completed">
                        <i class="check icon"></i>
                    </button>
                    <button class="ui mini blue icon button edit-btn" title="Edit Task">
                        <i class="edit icon"></i>
                    </button>
                    <button class="ui mini red icon button delete-btn" title="Delete Task">
                        <i class="trash icon"></i>
                    </button>
                </td>
            `;
            taskList.appendChild(tr);
        });
    },

    // Prepare the form for editing an existing task
    prepareForm: (task = null) => {
        const { formTitle, taskTitleInput, taskDescInput, taskDueDateInput, taskStatusInput, taskIdInput } = ui.selectors;

        if (task) {
            // Editing an existing task
            formTitle.textContent = 'Edit Task';
            taskIdInput.value = task.TaskID;
            taskTitleInput.value = task.TaskHeading;
            taskDescInput.value = task.TaskDescription;
            // Format date for input field: YYYY-MM-DD
            taskDueDateInput.value = new Date(task.DueDate).toISOString().split('T')[0];
            taskStatusInput.value = task.Status;
        } else {
            // Creating a new task
            formTitle.textContent = 'Create New Task';
            ui.selectors.taskForm.reset();
            taskIdInput.value = '';
        }
        ui.showModal();
    },

    // Get form data for submission
    getFormData: () => {
        const { taskTitleInput, taskDescInput, taskDueDateInput, taskStatusInput, taskIdInput } = ui.selectors;
        return {
            TaskID: taskIdInput.value,
            TaskHeading: taskTitleInput.value,
            TaskDescription: taskDescInput.value,
            DueDate: taskDueDateInput.value,
            Status: taskStatusInput.value
        };
    }
};

