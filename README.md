# Judiciary Case Management System

A full-stack application for managing and analyzing legal cases using AI-powered summarization and prioritization.

## Features

- AI-powered case summarization using GPT-4
- Automated case prioritization based on category and pending years
- Modern React frontend with Tailwind CSS
- MongoDB database for case storage
- RESTful API endpoints

## Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB
- OpenAI API key

## Setup

### Backend Setup

1. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=mongodb://localhost:27017/
```

4. Start the Flask server:
```bash
python server.py
```

The backend will run at `http://127.0.0.1:5000`

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the React development server:
```bash
npm start
```

The frontend will run at `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter case details in the form:
   - Case text
   - Case category
   - Number of pending years
3. Click "Analyze Case" to get:
   - AI-generated case summary
   - Priority level (High/Medium/Low)

## API Endpoints

- `POST /add_case`: Add a new case and get summary/priority
- `POST /summarize`: Get AI-generated summary for case text
- `GET /cases`: Retrieve all stored cases

## Technologies Used

- Backend: Flask, OpenAI API, MongoDB
- Frontend: React, Tailwind CSS, Axios
- Database: MongoDB
- AI: OpenAI GPT-4 