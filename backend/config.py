# backend/config.py

import os

# Get the absolute path of the directory 
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Define the database URI
DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'instance', 'tasks.db')