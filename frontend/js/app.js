// frontend/js/app.js

document.addEventListener('DOMContentLoaded', () => {

    const loadTasks = async () => {
        try {
            const tasks = await api.getTasks();
            ui.renderTasks(tasks);
        } catch (error) {
            console.error(error);
            alert('Could not load tasks.');
        }
    };

    ui.elements.newTaskBtn.addEventListener('click', () => {
        ui.openNewTaskModal();
    });

    ui.elements.saveTaskBtn.addEventListener('click', async () => {
        const taskId = ui.elements.taskId.value;
        const taskData = ui.getFormData();

        if (!taskData.TaskHeading) {
            alert('Task Heading is required.');
            return;
        }

        try {
            if (taskId) {
                await api.updateTask(taskId, taskData);
            } else {
                await api.createTask(taskData);
            }
            ui.closeModal();
            loadTasks();
        } catch (error) {
            console.error(error);
            alert('Failed to save the task.');
        }
    });

    // UPDATED: Changed from taskList to taskListBody
    ui.elements.taskListBody.addEventListener('click', async (event) => {
        const target = event.target;
        // Use .closest() to find the button and then the table row
        const button = target.closest('button');
        if (!button) return;

        const taskId = button.dataset.id;

        // Handle Delete
        if (button.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this task?')) {
                try {
                    await api.deleteTask(taskId);
                    loadTasks();
                } catch (error) {
                    console.error(error);
                    alert('Failed to delete task.');
                }
            }
        }

        // Handle Edit
        if (button.classList.contains('edit-btn')) {
            try {
                const tasks = await api.getTasks();
                const taskToEdit = tasks.find(t => t.TaskID == taskId);
                if (taskToEdit) {
                    ui.openEditTaskModal(taskToEdit);
                }
            } catch (error) {
                console.error(error);
                alert('Could not fetch task details.');
            }
        }
        
        // NEW: Handle Mark as Completed
        if (button.classList.contains('complete-btn')) {
            try {
                // We only need to send the new status
                await api.updateTask(taskId, { Status: 'Completed' });
                loadTasks(); // Refresh list to show updated status
            } catch (error) {
                console.error(error);
                alert('Failed to mark task as completed.');
            }
        }
    });

    $('.ui.dropdown').dropdown();

    loadTasks();
});

