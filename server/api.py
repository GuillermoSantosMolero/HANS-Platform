import json
from threading import Thread
from pathlib import Path

from flask import Flask, request, send_file, jsonify, send_from_directory
from werkzeug.serving import make_server

from context import AppContext, Session, Participant

QUESTIONS_FOLDER = Path('questions')

class ServerAPI(Thread):
    def __init__(self, host='0.0.0.0', port=5000):
        Thread.__init__(self)
        self.app = Flask(__name__)

        @self.app.route('/')
        def index_handle():
            return send_from_directory('../client', 'index.html')

        @self.app.route('/api/session/<int:session_id>', methods=['GET'])
        def api_session_handle_get(session_id: int):
            session = AppContext.sessions.get(session_id, None)
            if session is None:
                return "Session not found", 404

            return jsonify(session.as_json)

        @self.app.route('/api/session', methods=['GET'])
        def api_get_all_sessions():
            return jsonify([session.as_json for session in AppContext.sessions])

        @self.app.route('/api/session', methods=['POST'])
        def api_create_session():
            session = Session()
            AppContext.sessions[session.id] = session
            if self.on_session_created:
                self.on_session_created(session)
            
            return jsonify(session.as_json)

        @self.app.route('/api/session/<int:session_id>', methods=['POST'])
        def api_edit_session(session_id: int):
            session = AppContext.sessions.get(session_id, None)
            if session is None:
                return "Session not found", 404

            session_data = request.json
            if any(
                key not in ['status', 'question_id', 'duration']
                for key in session_data.keys()
            ):
                return "Invalid parameter", 400
            
            if 'status' in session_data:
                try:
                    session.status = Session.Status(session_data['status'])
                except ValueError:
                    return "Requested status is not valid", 400
            
            if 'question_id' in session_data:
                question_id = session_data['question_id']
                if not isinstance(question_id, int):
                    return "Requested question_id must be an integer", 400

                if not (QUESTIONS_FOLDER / str(question_id)).is_dir():
                    return "Requested question_id doesn't exist", 404
                
                session.active_question = question_id
            
            if 'duration' in session_data:
                if not isinstance(session_data['duration'], int):
                    return "Requested duration must be an integer", 400
                
                session.duration = session_data['duration']

            return jsonify(session.as_json)

        @self.app.route('/api/session/<int:session_id>/participants', methods=['GET'])
        def api_session_get_all_participants(session_id: int):
            session = AppContext.sessions.get(session_id, None)
            if session is None:
                return "Session not found", 404

            return jsonify([participant.as_json for participant in session.participants])

        @self.app.route('/api/session/<int:session_id>/participants', methods=['POST'])
        def api_session_add_participant(session_id: int):
            if 'user' not in request.json:
                return "Invalid request", 400
            username = request.json['user']
            
            session = AppContext.sessions.get(session_id, None)
            if session is None:
                return "Session not found", 404

            if username in session.participants:
                return "Participant already joined session", 400

            participant = Participant(username)
            session.participants[participant.id] = participant

            if self.on_participant_joined:
                self.on_participant_joined(session, participant)

            return jsonify(participant.as_json)

        @self.app.route('/api/question/<int:question_id>')
        def api_question_handle(question_id: int):
            question_folder = QUESTIONS_FOLDER / str(question_id)
            if not question_folder.is_dir():
                return "Question not found", 404

            info_path = question_folder / 'info.json'
            if not info_path.is_file():
                return "Question info not found", 500
            
            with open(info_path, 'r') as f:
                data = json.load(f)
            return jsonify(data)
        
        @self.app.route('/api/question/<int:question_id>/image')
        def api_question_image_handle(question_id: int):
            question_folder = QUESTIONS_FOLDER / str(question_id)
            if not question_folder.is_dir():
                return "Question not found", 404

            img_path = next(question_folder.glob('img.*'))
            if not img_path.is_file():
                return "Image not found for this question", 500
            
            return send_file(img_path)

        self.server = make_server(host, port, self.app)
        self.ctx = self.app.app_context()
        self.ctx.push()

        self.on_start = None
        self.on_session_created = None
        self.on_participant_joined = None

    def run(self):
        if callable(self.on_start): self.on_start()
        self.server.serve_forever()
    
    def shutdown(self):
        self.server.shutdown()