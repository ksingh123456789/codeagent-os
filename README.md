# CodeAgent OS

This is a multi-tenant AI coding infrastructure project.

## Repository Structure

This project is organized as a monorepo containing multiple applications and services:

- `/apps` - Frontend applications and user interfaces.
- `/backend` - Core backend services and APIs.
- `/packages` - Shared packages, libraries, and utilities used across apps and backend.
- `/docs` - Project documentation.

## Setup and Installation

### Prerequisites
- Node.js & npm (for frontend and shared packages)
- Python (for backend services and root utility scripts)

### Installation

1. **Install Node dependencies:**
   ```bash
   npm install
   ```

2. **Set up Python Virtual Environment:**
   Ensure you activate the virtual environment at the root of the project to access Python dependencies for backend and root-level scripts.
   ```bash
   # Windows
   .\venv\Scripts\activate

   # Mac/Linux
   source venv/bin/activate
   ```

## Useful Commands
*(Add any custom scripts here, e.g., for running the database or starting the backend server).*
