# backend/routes.py

from flask import request, jsonify
import sqlite3
import os

# --- Robust Path Configuration ---
# This ensures the API always knows where to find the database,
# regardless of where the app is run from.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, 'instance', 'tasks.db')

def get_db_connection():
    """Establishes a connection to the database."""
    conn = sqlite3.connect(DATABASE_PATH)
    # This makes it possible to access columns by name (like a dictionary)
    conn.row_factory = sqlite3.Row
    return conn

def register_routes(app):

    # GET all tasks
    @app.route('/api/tasks', methods=['GET'])
    def get_tasks():
        try:
            conn = get_db_connection()
            tasks_cursor = conn.execute('SELECT * FROM tasks ORDER BY CreatedAt DESC').fetchall()
            conn.close()
            tasks = [dict(row) for row in tasks_cursor]
            return jsonify(tasks)
        except sqlite3.OperationalError:
            return jsonify({"error": "Database not found or table missing. Have you run database.py?"}), 500

    # POST a new task
    @app.route('/api/tasks', methods=['POST'])
    def add_task():
        data = request.get_json()
        
        if not data or 'TaskHeading' not in data or not data['TaskHeading'].strip():
            return jsonify({'error': 'TaskHeading is required'}), 400

        heading = data['TaskHeading']
        description = data.get('TaskDescription', '')
        due_date = data.get('DueDate')
        status = data.get('Status', 'Pending') # Added status handling

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO tasks (TaskHeading, TaskDescription, DueDate, Status) VALUES (?, ?, ?, ?)',
            (heading, description, due_date, status)
        )
        new_task_id = cursor.lastrowid
        conn.commit()
        
        new_task = conn.execute('SELECT * FROM tasks WHERE TaskID = ?', (new_task_id,)).fetchone()
        conn.close()

        return jsonify(dict(new_task)), 201
    
    # +++ START OF THE FIX +++
    # GET a single task by ID
    @app.route('/api/tasks/<int:task_id>', methods=['GET'])
    def get_task(task_id):
        conn = get_db_connection()
        task = conn.execute('SELECT * FROM tasks WHERE TaskID = ?', (task_id,)).fetchone()
        conn.close()
        
        if task is None:
            return jsonify({'error': 'Task not found'}), 404
            
        return jsonify(dict(task))
    # +++ END OF THE FIX +++

    # PUT (update) a task by ID
    @app.route('/api/tasks/<int:task_id>', methods=['PUT'])
    def update_task(task_id):
        conn = get_db_connection()
        task = conn.execute('SELECT * FROM tasks WHERE TaskID = ?', (task_id,)).fetchone()

        if task is None:
            conn.close()
            return jsonify({'error': 'Task not found'}), 404

        data = request.get_json()
        fields = []
        params = []
        
        for key in ['TaskHeading', 'TaskDescription', 'DueDate', 'Status']:
            if key in data:
                fields.append(f"{key} = ?")
                params.append(data[key])
        
        if not fields:
            conn.close()
            return jsonify({'error': 'No fields to update'}), 400

        params.append(task_id)
        query = f"UPDATE tasks SET {', '.join(fields)} WHERE TaskID = ?"
        
        conn.execute(query, tuple(params))
        conn.commit()
        
        updated_task = conn.execute('SELECT * FROM tasks WHERE TaskID = ?', (task_id,)).fetchone()
        conn.close()

        return jsonify(dict(updated_task))

    # DELETE a task by ID
    @app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
    def delete_task(task_id):
        conn = get_db_connection()
        task = conn.execute('SELECT * FROM tasks WHERE TaskID = ?', (task_id,)).fetchone()
        
        if task is None:
            conn.close()
            return jsonify({'error': 'Task not found'}), 404

        conn.execute('DELETE FROM tasks WHERE TaskID = ?', (task_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Task deleted successfully'})

