# backend/database.py
import sqlite3
import os

# --- Robust Path Configuration ---
# Get the absolute path of the directory where this script is located (i.e., the 'backend' folder)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Define the path for the 'instance' folder inside 'backend'
INSTANCE_FOLDER = os.path.join(BASE_DIR, 'instance')
# Define the full path to the database file
DATABASE_PATH = os.path.join(INSTANCE_FOLDER, 'tasks.db')

def init_db():
    """
    Initializes the database. Creates the instance folder and the tasks table if they don't exist.
    """
    try:
        # Step 1: Create the 'instance' folder if it doesn't already exist.
        if not os.path.exists(INSTANCE_FOLDER):
            print(f"Creating instance folder at: {INSTANCE_FOLDER}")
            os.makedirs(INSTANCE_FOLDER)

        # Step 2: Connect to the database. This will create the .db file if it's not there.
        print(f"Connecting to database at: {DATABASE_PATH}")
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        # Step 3: Execute the SQL command to create the 'tasks' table.
        print("Ensuring 'tasks' table exists...")
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            TaskID INTEGER PRIMARY KEY AUTOINCREMENT,
            TaskHeading TEXT NOT NULL,
            TaskDescription TEXT,
            CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            DueDate TEXT,
            Status TEXT NOT NULL DEFAULT 'Pending'
        )
        ''')

        # Step 4: Commit the changes and close the connection.
        conn.commit()
        conn.close()
        print("\nDatabase initialized successfully!")
        print(f"Database file should be located at: {DATABASE_PATH}")

    except Exception as e:
        # Catch and print any error that occurs during the process.
        print(f"\nAn error occurred during database initialization: {e}")

# This part allows the script to be run directly from the command line.
if __name__ == '__main__':
    init_db()

