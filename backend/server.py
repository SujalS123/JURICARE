from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import logging
from bson import ObjectId
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get the absolute path of the frontend build folder
frontend_build_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend/build'))

app = Flask(__name__, static_folder=frontend_build_path, static_url_path="/")

@app.route('/')
def serve():
    index_path = os.path.join(frontend_build_path, 'index.html')

    if not os.path.exists(index_path):
        return "index.html not found!", 404

    return send_from_directory(frontend_build_path, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(frontend_build_path, 'index.html')


CORS(app)  # Enable Cross-Origin Requests

# Configure Gemini API
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    # Configure the API
    genai.configure(api_key=api_key)
    
    # List available models
    available_models = list(genai.list_models())
    logger.info("Available models:")
    for m in available_models:
        logger.info(f"- {m.name}")
    
    # Use the correct model name
    model = genai.GenerativeModel('gemini-1.5-pro')
    logger.info("Gemini API configured successfully")
except Exception as e:
    logger.error(f"Error configuring Gemini API: {str(e)}")
    raise

# Connect to MongoDB
try:
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    db = client["judiciary"]
    cases_collection = db["cases"]
    logger.info("MongoDB connected successfully")
except Exception as e:
    logger.error(f"Error connecting to MongoDB: {str(e)}")
    raise

 

# AI-powered case summarization
def generate_case_summary(case_text):
    try:
        if not case_text:
            return None

        logger.info("Generating case summary...")
        prompt = f"""You are a legal expert. Please provide a well-structured summary of this legal case. Format the response in HTML with proper styling:

1. Use <h2> tags for main sections
2. Use <h3> tags for subsections
3. Use <ul> and <li> for bullet points
4. Use <p> tags for paragraphs
5. Use <strong> for important terms
6. Use <em> for emphasis
7. Add appropriate spacing and line breaks
8. Use <div class="section"> for major sections
9. Include a brief introduction and conclusion

Here's the case text:

{case_text}"""

        response = model.generate_content(prompt)
        summary = response.text
        logger.info("Summary generated successfully")
        return summary
    except Exception as e:
        logger.error(f"Error in generate_case_summary: {str(e)}")
        return None

@app.route("/summarize", methods=["POST"])
def summarize_case():
    try:
        data = request.json
        case_text = data.get("case_text")

        if not case_text:
            return jsonify({"error": "No case text provided"}), 400

        summary = generate_case_summary(case_text)
        if summary:
            return jsonify({"summary": summary})
        else:
            return jsonify({"error": "Failed to generate summary"}), 500
    except Exception as e:
        logger.error(f"Error in summarize_case: {str(e)}")
        return jsonify({"error": str(e)}), 500

# AI-powered case analysis
@app.route("/analyze_case", methods=["POST"])
def analyze_case():
    try:
        data = request.get_json()
        case_text = data.get("case_text")
        category = data.get("category", "")

        if not case_text:
            return jsonify({"error": "No case text provided"}), 400

        # Generate summary
        summary = generate_case_summary(case_text)
        if not summary:
            return jsonify({"error": "Failed to generate case summary"}), 500

        # Predict priority using AI
        priority_prompt = f"""As a legal expert, analyze this case and determine its priority level (High, Medium, or Low) based on the following factors:
1. Case complexity
2. Legal implications
3. Time sensitivity
4. Social impact
5. Precedential value

Case Category: {category}
Case Text: {case_text}

Respond with ONLY one word: High, Medium, or Low"""

        priority_response = model.generate_content(priority_prompt)
        predicted_priority = priority_response.text.strip().upper()
        
        # Validate and normalize priority
        if predicted_priority not in ["HIGH", "MEDIUM", "LOW"]:
            predicted_priority = "MEDIUM"  # Default to medium if unclear
        
        predicted_priority = predicted_priority.capitalize()

        return jsonify({
            "summary": summary,
            "predicted_priority": predicted_priority,
            "category": category
        })

    except Exception as e:
        logger.error(f"Error in analyze_case: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Add a new function for direct analysis
def analyze_case_direct(case_text, category):
    try:
        if not case_text:
            return jsonify({"error": "No case text provided"}), 400

        # Generate summary
        summary = generate_case_summary(case_text)
        if not summary:
            return jsonify({"error": "Failed to generate case summary"}), 500

        # Predict priority using AI
        priority_prompt = f"""As a legal expert, analyze this case and determine its priority level (High, Medium, or Low) based on the following factors:
1. Case complexity
2. Legal implications
3. Time sensitivity
4. Social impact
5. Precedential value

Case Category: {category}
Case Text: {case_text}

Respond with ONLY one word: High, Medium, or Low"""

        priority_response = model.generate_content(priority_prompt)
        predicted_priority = priority_response.text.strip().upper()
        
        # Validate and normalize priority
        if predicted_priority not in ["HIGH", "MEDIUM", "LOW"]:
            predicted_priority = "MEDIUM"  # Default to medium if unclear
        
        predicted_priority = predicted_priority.capitalize()

        return jsonify({
            "summary": summary,
            "predicted_priority": predicted_priority,
            "category": category
        })

    except Exception as e:
        logger.error(f"Error in analyze_case_direct: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Case Prioritization
def assign_priority(case):
    try:
        if case["pending_years"] > 5:
            return "High"
        elif "criminal" in case["category"].lower():
            return "High"
        elif case["pending_years"] > 2:
            return "Medium"
        else:
            return "Low"
    except Exception as e:
        logger.error(f"Error in assign_priority: {str(e)}")
        return "Low"  # Default to low priority if there's an error

# Store & prioritize case
@app.route('/add_case', methods=['POST'])
def add_case():
    try:
        data = request.get_json()
        if not data or 'case_text' not in data:
            return jsonify({'error': 'Case text is required'}), 400

        # Generate case summary and priority
        # summary, priority = analyze_case_direct(data['case_text'])
        response = analyze_case_direct(data['case_text'], data.get('category', 'Uncategorized'))
        response_json = response.get_json()  # Extract JSON data from Flask response

        if "error" in response_json:
            return jsonify({'error': response_json["error"]}), 500

        summary = response_json["summary"]
        priority = response_json["predicted_priority"]

        # Generate unique case ID
        case_id = f"CASE-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8]}"
        
        # Calculate initial pending years
        # start_date = datetime.fromisoformat(data.get('start_date', datetime.now().isoformat()))
        def parse_date(date_str, default=None):
            try:
                return datetime.fromisoformat(date_str)
            except (ValueError, TypeError):
                return default or datetime.now()

        start_date = parse_date(data.get('start_date'))
        next_hearing_date = parse_date(data.get('next_hearing_date'))
        last_hearing_date = parse_date(data.get('last_hearing_date'))

        pending_years = (datetime.now() - start_date).days / 365.25
        
        # Create case object
        case = {
            'case_id': case_id,
            'case_text': data['case_text'],
            'category': data.get('category', 'Uncategorized'),
            'priority': priority,
            'status': 'Open',
            'start_date': start_date,
            'next_hearing_date': datetime.fromisoformat(data.get('next_hearing_date', datetime.now().isoformat())),
            'last_hearing_date': datetime.fromisoformat(data.get('last_hearing_date', datetime.now().isoformat())),
            'summary': summary,
            'pending_years': pending_years
        }
        
        # Insert into MongoDB
        result = cases_collection.insert_one(case)
        case['_id'] = str(result.inserted_id)
        
        logging.info(f"Case added successfully with ID: {case_id}")
        return jsonify(case), 201
        
    except Exception as e:
        logging.error(f"Error adding case: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Get all cases
@app.route("/cases", methods=["GET"])
def get_cases():
    try:
        priority = request.args.get('priority')
        status = request.args.get('status')
        query = {}
        if priority:
            query["priority"] = priority
        if status:
            query["status"] = status
        cases = list(cases_collection.find(query))
        # Convert ObjectId to string for JSON serialization
        for case in cases:
            case['_id'] = str(case['_id'])
        return jsonify(cases)
    except Exception as e:
        logger.error(f"Error in get_cases: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Get case by ID
@app.route("/cases/<case_id>", methods=["GET"])
def get_case_by_id(case_id):
    try:
        case = cases_collection.find_one({"_id": ObjectId(case_id)})
        if case:
            case['_id'] = str(case['_id'])
            return jsonify(case)
        return jsonify({"error": "Case not found"}), 404
    except Exception as e:
        logger.error(f"Error in get_case_by_id: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Get case statistics
@app.route('/api/cases/stats', methods=['GET'])
def get_case_stats():
    try:
        # Get filter parameters
        time_range = request.args.get('time_range', 'all')
        category = request.args.get('category', 'all')
        
        # Build query
        query = {}
        
        # Apply time range filter
        if time_range != 'all':
            current_date = datetime.now()
            if time_range == 'month':
                query['filing_date'] = {'$gte': current_date - timedelta(days=30)}
            elif time_range == 'year':
                query['filing_date'] = {'$gte': current_date - timedelta(days=365)}
        
        # Apply category filter
        if category != 'all':
            query['category'] = category

        # Get all cases based on query
        cases = list(cases_collection.find(query))
        
        # Calculate statistics
        total_cases = len(cases)
        priority_counts = {}
        status_counts = {}
        category_counts = {}
        cases_over_time = {}
        total_duration = 0
        completed_cases = 0

        for case in cases:
            # Count priorities
            priority = case.get('priority', 'Unknown')
            priority_counts[priority] = priority_counts.get(priority, 0) + 1

            # Count statuses
            status = case.get('status', 'Unknown')
            status_counts[status] = status_counts.get(status, 0) + 1

            # Count categories
            cat = case.get('category', 'Unknown')
            category_counts[cat] = category_counts.get(cat, 0) + 1

            # Calculate duration for completed cases
            if status == 'Completed':
                completed_cases += 1
                filing_date = case.get('filing_date')
                completion_date = case.get('completion_date')
                if filing_date and completion_date:
                    duration = (completion_date - filing_date).days / 365.25  # Convert to years
                    total_duration += duration

            # Group cases by month for time series
            filing_date = case.get('filing_date')
            if filing_date:
                month_key = filing_date.strftime('%Y-%m')
                cases_over_time[month_key] = cases_over_time.get(month_key, 0) + 1

        # Calculate average duration
        average_case_duration = total_duration / completed_cases if completed_cases > 0 else 0

        # Sort time series data
        sorted_time_data = dict(sorted(cases_over_time.items()))

        return jsonify({
            'total_cases': total_cases,
            'priority_counts': priority_counts,
            'status_counts': status_counts,
            'category_counts': category_counts,
            'cases_over_time': sorted_time_data,
            'average_case_duration': average_case_duration
        })

    except Exception as e:
        print(f"Error getting case stats: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/cases/<case_id>/history', methods=['POST'])
def add_case_history(case_id):
    try:
        data = request.json
        case = cases_collection.find_one({'_id': ObjectId(case_id)})
        if not case:
            return jsonify({'error': 'Case not found'}), 404

        history_entry = {
            'timestamp': datetime.utcnow(),
            'action': data.get('action'),
            'details': data.get('details'),
            'user': data.get('user', 'System')
        }

        if 'history' not in case:
            case['history'] = []
        case['history'].append(history_entry)
        
        cases_collection.update_one(
            {'_id': ObjectId(case_id)},
            {'$set': {'history': case['history']}}
        )

        return jsonify({'message': 'History updated successfully'})
    except Exception as e:
        logging.error(f"Error adding case history: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/cases/<case_id>/history', methods=['GET'])
def get_case_history(case_id):
    try:
        case = cases_collection.find_one({'_id': ObjectId(case_id)})
        if not case:
            return jsonify({'error': 'Case not found'}), 404

        history = case.get('history', [])
        return jsonify(history)
    except Exception as e:
        logging.error(f"Error fetching case history: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Update case status
@app.route("/cases/<case_id>/status", methods=["PUT"])
def update_case_status(case_id):
    try:
        data = request.json
        status = data.get("status")
        next_hearing = data.get("next_hearing")
        last_hearing = data.get("last_hearing")

        if not status:
            return jsonify({"error": "Status is required"}), 400

        update_data = {"status": status}
        if next_hearing:
            update_data["next_hearing"] = next_hearing
        if last_hearing:
            update_data["last_hearing"] = last_hearing

        result = cases_collection.update_one(
            {"_id": ObjectId(case_id)},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            return jsonify({"error": "Case not found"}), 404

        return jsonify({"message": "Case status updated successfully"})
    except Exception as e:
        logger.error(f"Error updating case status: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/cases/<case_id>/hearing", methods=["POST"])
def schedule_hearing(case_id):
    try:
        data = request.get_json()
        hearing_date = datetime.fromisoformat(data.get('hearing_date'))
        notes = data.get('notes', '')
        
        case = cases_collection.find_one({'case_id': case_id})
        if not case:
            return jsonify({'error': 'Case not found'}), 404
            
        # Update last hearing if exists
        if case.get('next_hearing'):
            case['last_hearing'] = case['next_hearing']
            
        # Update next hearing
        case['next_hearing'] = hearing_date
        
        # Add to hearing history
        hearing_record = {
            'date': hearing_date,
            'notes': notes,
            'status': 'Scheduled',
            'created_at': datetime.now()
        }
        
        if 'hearing_history' not in case:
            case['hearing_history'] = []
        case['hearing_history'].append(hearing_record)
        
        # Update case
        cases_collection.update_one(
            {'case_id': case_id},
            {
                '$set': {
                    'next_hearing': hearing_date,
                    'last_hearing': case.get('last_hearing'),
                    'hearing_history': case['hearing_history'],
                    'updated_at': datetime.now()
                }
            }
        )
        
        return jsonify({'message': 'Hearing scheduled successfully'}), 200
        
    except Exception as e:
        logging.error(f"Error scheduling hearing: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route("/cases/<case_id>/hearing/<hearing_id>/complete", methods=["POST"])
def complete_hearing(case_id, hearing_id):
    try:
        data = request.get_json()
        outcome = data.get('outcome', '')
        next_steps = data.get('next_steps', '')
        
        case = cases_collection.find_one({'case_id': case_id})
        if not case:
            return jsonify({'error': 'Case not found'}), 404
            
        # Find and update the hearing record
        for hearing in case.get('hearing_history', []):
            if str(hearing.get('_id')) == hearing_id:
                hearing['status'] = 'Completed'
                hearing['outcome'] = outcome
                hearing['next_steps'] = next_steps
                hearing['completed_at'] = datetime.now()
                break
                
        # Update case
        cases_collection.update_one(
            {'case_id': case_id},
            {
                '$set': {
                    'hearing_history': case['hearing_history'],
                    'updated_at': datetime.now()
                }
            }
        )
        
        return jsonify({'message': 'Hearing completed successfully'}), 200
        
    except Exception as e:
        logging.error(f"Error completing hearing: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route("/cases/<case_id>/judge_notes", methods=["POST"])
def add_judge_notes(case_id):
    try:
        data = request.get_json()
        note = {
            'content': data.get('content', ''),
            'created_at': datetime.now(),
            'type': data.get('type', 'general')  # general, decision, observation
        }
        
        case = cases_collection.find_one({'case_id': case_id})
        if not case:
            return jsonify({'error': 'Case not found'}), 404
            
        if 'judge_notes' not in case:
            case['judge_notes'] = []
        case['judge_notes'].append(note)
        
        cases_collection.update_one(
            {'case_id': case_id},
            {
                '$set': {
                    'judge_notes': case['judge_notes'],
                    'updated_at': datetime.now()
                }
            }
        )
        
        return jsonify({'message': 'Judge notes added successfully'}), 200
        
    except Exception as e:
        logging.error(f"Error adding judge notes: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route("/cases/<case_id>/complete", methods=["POST"])
def complete_case(case_id):
    try:
        data = request.get_json()
        final_decision = data.get('final_decision', '')
        completion_date = datetime.now()
        
        case = cases_collection.find_one({'case_id': case_id})
        if not case:
            return jsonify({'error': 'Case not found'}), 404
            
        # Calculate total case duration
        start_date = case.get('start_date', case.get('created_at'))
        case_duration = (completion_date - start_date).days / 365.25  # in years
        
        # Update case status and add completion record
        cases_collection.update_one(
            {'case_id': case_id},
            {
                '$set': {
                    'status': 'Completed',
                    'final_decision': final_decision,
                    'completion_date': completion_date,
                    'case_duration': case_duration,
                    'updated_at': datetime.now()
                }
            }
        )
        
        return jsonify({'message': 'Case completed successfully'}), 200
        
    except Exception as e:
        logging.error(f"Error completing case: {str(e)}")
        return jsonify({'error': str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True) 
if __name__ == "__main__":
    # Get port from environment variable or default to 5000
    port = int(os.getenv('PORT', 5000))
    # Set debug mode based on environment
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host="0.0.0.0", port=port, debug=debug) 
