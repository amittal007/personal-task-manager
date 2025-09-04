// frontend/js/ui.js

const ui = {
    // Selectors for DOM elements
    selectors: {
        taskListBody: document.getElementById('task-list-body'),
        taskForm: document.getElementById('task-form'),
        formTitle: document.getElementById('form-title'),
        taskTitleInput: document.getElementById('task-title'),
        taskDescInput: document.getElementById('task-description'),
        taskDueDateInput: document.getElementById('task-due-date'),
        taskStatusInput: document.getElementById('task-status'),
        taskIdInput: document.getElementById('task-id'),
        taskModal: $('#task-modal'), // jQuery selector for the main modal
        deleteConfirmModal: $('#delete-confirm-modal'), // jQuery selector for the delete modal
        newTaskButton: document.getElementById('new-task-btn'),
    },

    // Initialize the Semantic UI components
    initialize: () => {
        // Initialize dropdowns
        $('.ui.dropdown').dropdown();

        // Attach event listener for the "New Task" button
        ui.selectors.newTaskButton.addEventListener('click', () => {
            ui.prepareForm(); // Prepare form for adding a new task
        });

        // Configure the main task modal
        ui.selectors.taskModal.modal({
            closable: true,
            onDeny: () => true, // Allows the "Cancel" button to close the modal
            onApprove: () => false // Prevents the "Save" button from closing the modal automatically
        });
    },
    
    // Render all tasks in the table
    renderTasks: (tasks) => {
        const { taskListBody } = ui.selectors;
        taskListBody.innerHTML = ''; // Clear existing tasks

        if (!tasks || tasks.length === 0) {
            taskListBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No tasks found. Click "New Task" to add one!</td></tr>';
            return;
        }

        tasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.dataset.id = task.TaskID;
            if (task.Status === 'Completed') {
                tr.classList.add('completed-task');
            }

            const createdAt = new Date(task.CreatedAt).toLocaleDateString();
            const dueDate = new Date(task.DueDate).toLocaleDateString();
            
            tr.innerHTML = `
                <td data-label="Status">
                    <span class="ui ${task.Status === 'Completed' ? 'green' : task.Status === 'In Progress' ? 'blue' : 'grey'} mini label">${task.Status}</span>
                </td>
                <td data-label="Task">
                    <div class="task-heading">${task.TaskHeading}</div>
                    <div class="task-description">${task.TaskDescription || ''}</div>
                </td>
                <td data-label="Due Date">${dueDate}</td>
                <td data-label="Created">${createdAt}</td>
                <td class="actions-cell">
                    <button class="ui mini ${task.Status === 'Completed' ? 'orange' : 'green'} icon button complete-btn" title="${task.Status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}">
                        <i class="${task.Status === 'Completed' ? 'undo' : 'check'} icon"></i>
                    </button>
                    <button class="ui mini blue icon button edit-btn" title="Edit Task">
                        <i class="edit icon"></i>
                    </button>
                    <button class="ui mini red icon button delete-btn" title="Delete Task">
                        <i class="trash icon"></i>
                    </button>
                </td>
            `;
            taskListBody.appendChild(tr);
        });
    },

    // Prepare the form for creating or editing a task
    prepareForm: (task = null) => {
        const { taskForm, formTitle, taskIdInput, taskTitleInput, taskDescInput, taskDueDateInput, taskModal } = ui.selectors;
        
        taskForm.classList.remove('error');

        if (task) {
            formTitle.textContent = 'Edit Task';
            taskIdInput.value = task.TaskID;
            taskTitleInput.value = task.TaskHeading;
            taskDescInput.value = task.TaskDescription;
            taskDueDateInput.value = new Date(task.DueDate).toISOString().split('T')[0];
            $('#task-status').dropdown('set selected', task.Status);
        } else {
            formTitle.textContent = 'Create New Task';
            taskForm.reset();
            $('#task-status').dropdown('clear');
            taskIdInput.value = '';
        }
        taskModal.modal('show');
    },

    // Get form data for submission
    getFormData: () => {
        const { taskIdInput, taskTitleInput, taskDescInput, taskDueDateInput, taskStatusInput } = ui.selectors;
        return {
            TaskID: taskIdInput.value,
            TaskHeading: taskTitleInput.value,
            TaskDescription: taskDescInput.value,
            DueDate: taskDueDateInput.value,
            Status: taskStatusInput.value
        };
    },

    // Show a confirmation dialog for deleting a task
    showDeleteConfirmation: (callback) => {
        ui.selectors.deleteConfirmModal
            .modal({
                closable: false,
                onDeny: () => true, // Callback for "No"
                onApprove: () => {   // Callback for "Yes, Delete"
                    callback();
                }
            })
            .modal('show');
    }
};

