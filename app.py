"""
Academic Management Dashboard - Flask Backend
A comprehensive web application for managing coursework, assignments, skills, and academic goals.
"""

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from datetime import datetime, date
import os
import json
from notion_client import Client
from typing import Dict, List, Any, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NotionAPI:
    """Handle all Notion API interactions"""
    
    def __init__(self, token: str):
        self.client = Client(auth=token)
        self.databases = {}
    
    def set_database_ids(self, database_ids: Dict[str, str]):
        """Set the database IDs for different collections"""
        self.databases = database_ids
    
    def query_database(self, database_name: str, filter_dict: Optional[Dict] = None) -> List[Dict]:
        """Query a Notion database with optional filters"""
        try:
            database_id = self.databases.get(database_name)
            if not database_id:
                logger.error(f"Database ID not found for: {database_name}")
                return []
            
            query_params = {"database_id": database_id}
            if filter_dict:
                query_params["filter"] = filter_dict
            
            response = self.client.databases.query(**query_params)
            return response.get("results", [])
        except Exception as e:
            logger.error(f"Error querying {database_name}: {str(e)}")
            return []
    
    def create_page(self, database_name: str, properties: Dict) -> Dict:
        """Create a new page in a Notion database"""
        try:
            database_id = self.databases.get(database_name)
            if not database_id:
                raise ValueError(f"Database ID not found for: {database_name}")
            
            response = self.client.pages.create(
                parent={"database_id": database_id},
                properties=properties
            )
            return response
        except Exception as e:
            logger.error(f"Error creating page in {database_name}: {str(e)}")
            return {}
    
    def update_page(self, page_id: str, properties: Dict) -> Dict:
        """Update an existing Notion page"""
        try:
            response = self.client.pages.update(
                page_id=page_id,
                properties=properties
            )
            return response
        except Exception as e:
            logger.error(f"Error updating page {page_id}: {str(e)}")
            return {}
    
    def delete_page(self, page_id: str) -> bool:
        """Archive/delete a Notion page"""
        try:
            self.client.pages.update(
                page_id=page_id,
                archived=True
            )
            return True
        except Exception as e:
            logger.error(f"Error deleting page {page_id}: {str(e)}")
            return False

def create_app():
    """Flask application factory"""
    app = Flask(__name__)
    app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Initialize Notion client
    notion_token = os.environ.get('NOTION_TOKEN')
    if not notion_token:
        logger.warning("NOTION_TOKEN not found in environment variables")
    
    notion = NotionAPI(notion_token) if notion_token else None
    
    # Sample database IDs - replace with actual IDs from your Notion workspace
    if notion:
        notion.set_database_ids({
            'courses': os.environ.get('NOTION_COURSES_DB'),
            'assignments': os.environ.get('NOTION_ASSIGNMENTS_DB'),
            'resources': os.environ.get('NOTION_RESOURCES_DB'),
            'skills': os.environ.get('NOTION_SKILLS_DB'),
            'goals': os.environ.get('NOTION_GOALS_DB'),
            'portfolio': os.environ.get('NOTION_PORTFOLIO_DB'),
            'reading': os.environ.get('NOTION_READING_DB'),
            'sessions': os.environ.get('NOTION_SESSIONS_DB'),
            'references': os.environ.get('NOTION_REFERENCES_DB')
        })
    
    @app.route('/')
    def dashboard():
        """Main dashboard page"""
        return render_template('dashboard.html')
    
    @app.route('/assignments')
    def assignments():
        """Assignments management page"""
        return render_template('assignments.html')
    
    @app.route('/skills')
    def skills():
        """Skills tracking page"""
        return render_template('skills.html')
    
    @app.route('/goals')
    def goals():
        """Goals management page"""
        return render_template('goals.html')
    
    @app.route('/portfolio')
    def portfolio():
        """Portfolio showcase page"""
        return render_template('portfolio.html')
    
    @app.route('/calendar')
    def calendar():
        """Calendar view page"""
        return render_template('calendar.html')
    
    @app.route('/analytics')
    def analytics():
        """Analytics and progress page"""
        return render_template('analytics.html')
    
    # API Endpoints
    @app.route('/api/assignments')
    def api_assignments():
        """Get all assignments"""
        if not notion:
            return jsonify([])
        
        assignments = notion.query_database('assignments')
        return jsonify(format_assignments(assignments))
    
    @app.route('/api/assignments', methods=['POST'])
    def api_create_assignment():
        """Create a new assignment"""
        if not notion:
            return jsonify({"error": "Notion not configured"}), 500
        
        data = request.get_json()
        properties = format_assignment_properties(data)
        
        result = notion.create_page('assignments', properties)
        if result:
            return jsonify({"success": True, "id": result.get("id")})
        else:
            return jsonify({"error": "Failed to create assignment"}), 500
    
    @app.route('/api/assignments/<assignment_id>', methods=['PUT'])
    def api_update_assignment(assignment_id):
        """Update an existing assignment"""
        if not notion:
            return jsonify({"error": "Notion not configured"}), 500
        
        data = request.get_json()
        properties = format_assignment_properties(data)
        
        result = notion.update_page(assignment_id, properties)
        if result:
            return jsonify({"success": True})
        else:
            return jsonify({"error": "Failed to update assignment"}), 500
    
    @app.route('/api/assignments/<assignment_id>', methods=['DELETE'])
    def api_delete_assignment(assignment_id):
        """Delete an assignment"""
        if not notion:
            return jsonify({"error": "Notion not configured"}), 500
        
        result = notion.delete_page(assignment_id)
        if result:
            return jsonify({"success": True})
        else:
            return jsonify({"error": "Failed to delete assignment"}), 500
    
    @app.route('/api/skills')
    def api_skills():
        """Get all skills"""
        if not notion:
            return jsonify([])
        
        skills = notion.query_database('skills')
        return jsonify(format_skills(skills))
    
    @app.route('/api/goals')
    def api_goals():
        """Get all goals"""
        if not notion:
            return jsonify([])
        
        goals = notion.query_database('goals')
        return jsonify(format_goals(goals))
    
    @app.route('/api/dashboard/stats')
    def api_dashboard_stats():
        """Get dashboard statistics"""
        if not notion:
            return jsonify({
                "total_assignments": 0,
                "pending_assignments": 0,
                "completed_assignments": 0,
                "active_goals": 0,
                "skills_in_progress": 0
            })
        
        assignments = notion.query_database('assignments')
        goals = notion.query_database('goals')
        skills = notion.query_database('skills')
        
        stats = {
            "total_assignments": len(assignments),
            "pending_assignments": len([a for a in assignments if get_property_value(a, 'Status') == 'Not Started']),
            "completed_assignments": len([a for a in assignments if get_property_value(a, 'Status') == 'Completed']),
            "active_goals": len([g for g in goals if get_property_value(g, 'Status') == 'Active']),
            "skills_in_progress": len([s for s in skills if get_property_value(s, 'Proficiency') in ['Beginner', 'Intermediate']])
        }
        
        return jsonify(stats)
    
    return app

def get_property_value(page: Dict, property_name: str) -> Any:
    """Extract property value from Notion page"""
    try:
        prop = page.get('properties', {}).get(property_name, {})
        prop_type = prop.get('type')
        
        if prop_type == 'title':
            return prop.get('title', [{}])[0].get('text', {}).get('content', '')
        elif prop_type == 'rich_text':
            return prop.get('rich_text', [{}])[0].get('text', {}).get('content', '')
        elif prop_type == 'select':
            return prop.get('select', {}).get('name', '')
        elif prop_type == 'multi_select':
            return [item.get('name', '') for item in prop.get('multi_select', [])]
        elif prop_type == 'date':
            date_obj = prop.get('date', {})
            return date_obj.get('start', '') if date_obj else ''
        elif prop_type == 'number':
            return prop.get('number', 0)
        elif prop_type == 'checkbox':
            return prop.get('checkbox', False)
        else:
            return ''
    except Exception:
        return ''

def format_assignments(assignments: List[Dict]) -> List[Dict]:
    """Format assignments for API response"""
    formatted = []
    for assignment in assignments:
        formatted.append({
            'id': assignment.get('id'),
            'title': get_property_value(assignment, 'Name'),
            'course': get_property_value(assignment, 'Course'),
            'due_date': get_property_value(assignment, 'Due Date'),
            'status': get_property_value(assignment, 'Status'),
            'priority': get_property_value(assignment, 'Priority'),
            'type': get_property_value(assignment, 'Type'),
            'progress': get_property_value(assignment, 'Progress'),
            'created': assignment.get('created_time', ''),
            'updated': assignment.get('last_edited_time', '')
        })
    return formatted

def format_skills(skills: List[Dict]) -> List[Dict]:
    """Format skills for API response"""
    formatted = []
    for skill in skills:
        formatted.append({
            'id': skill.get('id'),
            'name': get_property_value(skill, 'Name'),
            'category': get_property_value(skill, 'Category'),
            'proficiency': get_property_value(skill, 'Proficiency'),
            'progress': get_property_value(skill, 'Progress'),
            'priority': get_property_value(skill, 'Priority'),
            'tags': get_property_value(skill, 'Tags'),
            'created': skill.get('created_time', ''),
            'updated': skill.get('last_edited_time', '')
        })
    return formatted

def format_goals(goals: List[Dict]) -> List[Dict]:
    """Format goals for API response"""
    formatted = []
    for goal in goals:
        formatted.append({
            'id': goal.get('id'),
            'title': get_property_value(goal, 'Goal'),
            'type': get_property_value(goal, 'Type'),
            'status': get_property_value(goal, 'Status'),
            'priority': get_property_value(goal, 'Priority'),
            'target_date': get_property_value(goal, 'Target Date'),
            'progress': get_property_value(goal, 'Progress'),
            'category': get_property_value(goal, 'Category'),
            'created': goal.get('created_time', ''),
            'updated': goal.get('last_edited_time', '')
        })
    return formatted

def format_assignment_properties(data: Dict) -> Dict:
    """Format assignment data for Notion API"""
    properties = {}
    
    if 'title' in data:
        properties['Name'] = {
            'title': [{'text': {'content': data['title']}}]
        }
    
    if 'course' in data:
        properties['Course'] = {
            'select': {'name': data['course']}
        }
    
    if 'due_date' in data:
        properties['Due Date'] = {
            'date': {'start': data['due_date']}
        }
    
    if 'status' in data:
        properties['Status'] = {
            'select': {'name': data['status']}
        }
    
    if 'priority' in data:
        properties['Priority'] = {
            'select': {'name': data['priority']}
        }
    
    if 'type' in data:
        properties['Type'] = {
            'select': {'name': data['type']}
        }
    
    if 'progress' in data:
        properties['Progress'] = {
            'number': data['progress']
        }
    
    return properties

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
