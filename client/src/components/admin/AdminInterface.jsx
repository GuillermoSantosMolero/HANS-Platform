import { React, useEffect, useState } from "react";

import './AdminInterface.css';

export default function AdminInterface({ questions, sessions }) {
  const [selectedSession, setSelectedSession] = useState({ id: "", duration: 0, question_id: "", status: "" });
  useEffect(() => {
    if(sessions){
      setSelectedSession(sessions[0]);
      if(questions)
        setSelectedSession({ ...selectedSession, question_id: questions[0].id})
    }
  },[sessions],[questions]);

  const handleSessionChange = (event) => {
    const sessionId = parseInt(event.target.value);
    const session = sessions.find(s => s.id === sessionId);
    session.question_id = selectedSession.question_id;
    session.duration = selectedSession.duration;
    setSelectedSession(session);
  }
  const handleQuestionChange = (event) => {
    setSelectedSession({ ...selectedSession, question_id: event.target.value});
  }
  const createSession = (event) => {
      
  }
  return (
    <div className="main">
      <div className="sessionlist">

        <select onChange={handleSessionChange}>
          {sessions && sessions.map(session => (
            <option key={session.id} value={session.id}>Session {session.id}</option>
          ))}
        </select>
        <button>New Session</button>
      </div>
      <div className="sessiondetails">
        <div>
          <p>Valor de sessions:</p>
          <pre>{JSON.stringify(selectedSession, null, 2)}</pre>
        </div>
        <label>Id:</label>
        <input type="text" readOnly value={selectedSession && selectedSession.id} />
        <label>Duration:</label>
        <input type="text" value={selectedSession && selectedSession.duration} onChange={e => setSelectedSession({ ...selectedSession, duration: e.target.value})}/>
        <label>Question:</label>
        <select onChange={handleQuestionChange}>
          {questions && questions.map(question => (
            <option key={question.id} value={question.id}>{question.prompt}</option>
          ))}
        </select>
      </div>
      <div className="startsession" onClick={createSession}>
        <button>Start</button>
        <input type="text" readOnly />
      </div>
    </div>
  );
}