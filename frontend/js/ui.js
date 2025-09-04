// frontend/js/ui.js

const ui = {
    elements: {
        taskListBody: document.getElementById('task-list-body'), // Changed from taskList
        newTaskBtn: document.getElementById('new-task-btn'),
        taskModal: $('#task-modal'),
        modalTitle: document.getElementById('modal-title'),
        saveTaskBtn: document.getElementById('save-task-btn'),
        taskForm: document.getElementById('task-form'),
        taskId: document.getElementById('task-id'),
        taskHeading: document.getElementById('task-heading'),
        taskDescription: document.getElementById('task-description'),
        dueDate: document.getElementById('due-date'),
        taskStatus: document.getElementById('task-status')
    },

    statusColors: {
        'Pending': 'grey',
        'In Progress': 'blue',
        'Completed': 'green'
    },

    // NEW: Function to create a table row <tr> for a task
    createTaskTableRow: function(task) {
        const row = document.createElement('tr');
        // Add a class if the task is completed for special styling
        if (task.Status === 'Completed') {
            row.classList.add('completed-task');
        }

        const dueDate = task.DueDate ? new Date(task.DueDate + 'T00:00:00') : null;
        const formattedDate = dueDate ? dueDate.toLocaleDateString() : 'N/A';
        const statusColor = this.statusColors[task.Status] || 'grey';

        // The "Mark as Completed" button is disabled if the task is already completed
        const completeButton = `
            <button 
                class="ui icon button tiny green complete-btn" 
                data-id="${task.TaskID}" 
                ${task.Status === 'Completed' ? 'disabled' : ''}
            >
                <i class="check icon"></i>
            </button>
        `;

        row.innerHTML = `
            <td><div class="ui ${statusColor} label">${task.Status}</div></td>
            <td>
                <b>${task.TaskHeading}</b>
                <p>${task.TaskDescription || ''}</p>
            </td>
            <td>${formattedDate}</td>
            <td class="center aligned">
                <div class="ui buttons">
                    ${completeButton}
                    <button class="ui icon button tiny edit-btn" data-id="${task.TaskID}"><i class="edit icon"></i></button>
                    <button class="ui icon button tiny red delete-btn" data-id="${task.TaskID}"><i class="trash icon"></i></button>
                </div>
            </td>
        `;
        return row;
    },

    // UPDATED: Renders tasks into the table body
    renderTasks: function(tasks) {
        this.elements.taskListBody.innerHTML = ''; // Clear the table body
        if (tasks.length === 0) {
            this.elements.taskListBody.innerHTML = '<tr><td colspan="4" class="center aligned">No tasks yet. Add one!</td></tr>';
            return;
        }
        tasks.forEach(task => {
            const taskRow = this.createTaskTableRow(task);
            this.elements.taskListBody.appendChild(taskRow);
        });
    },

    clearModalForm: function() {
        this.elements.taskForm.reset();
        this.elements.taskId.value = '';
    },

    openNewTaskModal: function() {
        this.clearModalForm();
        this.elements.modalTitle.textContent = 'Create New Task';
        this.elements.taskModal.modal('show');
    },



    openEditTaskModal: function(task) {
        this.clearModalForm();
        this.elements.modalTitle.textContent = 'Edit Task';
        
        this.elements.taskId.value = task.TaskID;
        this.elements.taskHeading.value = task.TaskHeading;
        this.elements.taskDescription.value = task.TaskDescription;
        this.elements.dueDate.value = task.DueDate;
        $('#task-status').dropdown('set selected', task.Status);

        this.elements.taskModal.modal('show');
    },

    closeModal: function() {
        this.elements.taskModal.modal('hide');
    },

    getFormData: function() {
        return {
            TaskHeading: this.elements.taskHeading.value,
            TaskDescription: this.elements.taskDescription.value,
            DueDate: this.elements.dueDate.value,
            Status: this.elements.taskStatus.value
        };
    }
};

