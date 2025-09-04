**Personal Task Manager - Full-Stack Application**
A clean and efficient personal task management application built with a Python/Flask backend, a SQLite database, and a vanilla JavaScript frontend styled with Semantic UI. This project allows users to seamlessly create, view, update, and delete tasks through a responsive, table-based interface.

**Live Demo**
Frontend Application (Netlify): https://mypersonaltaskmanager.netlify.app/

Backend API Endpoint (PythonAnywhere): https://personaltaskmanager.pythonanywhere.com/api/tasks

**Features**

Full CRUD Functionality: Create, Read, Update, and Delete tasks.

Persistent Storage: Tasks are saved in a SQLite database.

Intuitive UI: A clean, table-based layout for easy viewing and management of tasks.

Task Status Tracking: Manage tasks with statuses like Pending, In Progress, and Completed.

Quick Actions: Mark tasks as completed with a single click.

Responsive Design: User-friendly experience across different screen sizes.

Modular Codebase: The backend and frontend code are organized into separate, maintainable modules.

**Tech Stack**

Category Technology

Backend Python, Flask, Flask-CORS, SQLite

Frontend HTML5, CSS3, Vanilla JavaScript

Styling Semantic UI

Deployment PythonAnywhere (Backend), Netlify (Frontend)

Version Control Git & GitHub

**How to Set Up and Run Locally**

Follow these instructions to get the project running on your local machine.

**Prerequisites**

Python 3.8 or newer

pip (Python package installer)

A web browser

1. Clone the Repository
   First, clone the project repository from GitHub to your local machine:

git clone "https://github.com/amittal007/personal-task-manager.git"

cd personal-task-manager

2. Backend Setup
   Navigate to the backend directory:

cd backend

**Create and activate a virtual environment:**

**On macOS/Linux:**

python3 -m venv venv
source venv/bin/activate

**On Windows:**

python -m venv venv
.\venv\Scripts\activate

**Install the required packages:**

pip install Flask Flask-Cors

**Initialize the database:**

Run the database.py script once to create the instance folder and the tasks.db file.

python database.py

**Run the Flask server:**

python app.py

The backend API will now be running at http://127.0.0.1:5000.

3. Frontend Setup
   Update the API URL for Local Development:

Open the file frontend/js/api.js.

Change the BASE_URL constant to point to your local server:

const BASE_URL = '[http://127.0.0.1:5000/api](http://127.0.0.1:5000/api)';
