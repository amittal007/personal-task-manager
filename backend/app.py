# backend/app.py

import os
from flask import Flask
from flask_cors import CORS
# This will import the function we created in routes.py
from routes import register_routes
# This will import and run the function to create the database if needed
from database import init_db

def create_app():
    """Creates and configures a Flask application instance."""
    app = Flask(__name__)
    # Allows the frontend (on a different address) to make requests to this backend
    CORS(app) 

    # --- Database Initialization ---
    # A crucial check to ensure the database and table exist before the app starts.
    # This makes setup easier as you only need to run one file.
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'tasks.db')
    if not os.path.exists(db_path):
        print("Database not found. Initializing...")
        init_db()

    # Register all the API routes from the routes.py file
    register_routes(app)
    print("API routes registered successfully.")

    return app

# This is the main execution block. It will only run when you execute `python app.py`.
if __name__ == '__main__':
    # Create the Flask app instance
    app = create_app()
    
    print("Starting Flask development server...")
    # Run the app. `debug=True` provides helpful error messages in the browser.
    # The server will be accessible at http://127.0.0.1:5000
    app.run(debug=True, port=5000)

