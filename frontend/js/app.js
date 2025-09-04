// frontend/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI components like modals and dropdowns
    ui.initialize();
    
    // Initial fetch of tasks when the page loads
    api.fetchTasks().then(ui.renderTasks).catch(err => {
        console.error(err);
        // Display a user-friendly error message in the table
        ui.renderTasks(null); 
    });

    const { taskForm, taskListBody, taskModal } = ui.selectors;

    // Handle form submission for creating or updating a task
    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = ui.getFormData();
        
        try {
            if (formData.TaskID) {
                await api.updateTask(formData.TaskID, formData);
            } else {
                await api.createTask(formData);
            }
            taskModal.modal('hide');
            const tasks = await api.fetchTasks();
            ui.renderTasks(tasks);
        } catch (error) {
            console.error('Failed to save task:', error);
            // Future improvement: show an error message in the UI
        }
    });

    // Use event delegation to handle clicks on task action buttons
    taskListBody.addEventListener('click', async (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const tr = button.closest('tr');
        const taskId = tr.dataset.id;

        // Handle Delete Button
        if (button.classList.contains('delete-btn')) {
            // Use the custom confirmation modal instead of the browser's confirm()
            ui.showDeleteConfirmation(async () => {
                try {
                    await api.deleteTask(taskId);
                    tr.remove(); // Remove the row from the UI immediately
                } catch (error) {
                    console.error('Failed to delete task:', error);
                }
            });
        }

        // Handle Edit Button
        if (button.classList.contains('edit-btn')) {
            try {
                const task = await api.fetchTaskById(taskId);
                ui.prepareForm(task); // Open the modal with the task's data
            } catch (error) {
                console.error(`Failed to fetch task ${taskId} for editing:`, error);
            }
        }
        
        // Handle Mark as Completed/Pending Button (Toggle)
        if (button.classList.contains('complete-btn')) {
            try {
                const task = await api.fetchTaskById(taskId);
                // Toggle the status
                const newStatus = task.Status === 'Completed' ? 'Pending' : 'Completed';
                const updatedTaskData = { ...task, Status: newStatus };
                
                await api.updateTask(taskId, updatedTaskData);
                
                // Refresh the entire list to reflect the change
                const tasks = await api.fetchTasks();
                ui.renderTasks(tasks);
            } catch (error) {
                console.error(`Failed to update task ${taskId} status:`, error);
            }
        }
    });
});

