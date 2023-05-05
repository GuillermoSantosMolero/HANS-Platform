import { React, useEffect, useState, useRef } from "react";

import './AdminInterface.css';
import { Session, SessionStatus } from '../../context/Session';
import { QuestionStatus } from '../../context/Question';

export default function AdminInterface({ username, password, questions, sessions, onSessionCreated }) {
  const [selectedSession, setSelectedSession] = useState({ id: "0", duration: 0, question_id: "", status: "" });
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(SessionStatus.Joining);
  const [question, setQuestion] = useState({ status: QuestionStatus.Undefined });

  useEffect(() => {
    if (sessions) {
      setSelectedSession(sessions[0]);
      if (questions)
        setSelectedSession({ ...selectedSession, question_id: questions[0].id })
    }
  }, [questions]);
  
  useEffect(() => {
    if (selectedSession) {
      setCurrentSession(new Session(selectedSession.id, 0,
        (controlMessage) => {
          switch (controlMessage.type) {
            case 'ready': {

              break;
            }
            default: break;
          }
        },
        null
      ));
    }
  }, [selectedSession]);


  const handleSessionChange = (event) => {
    const sessionId = parseInt(event.target.value);
    const session = sessions.find(s => s.id === sessionId);
    session.question_id = selectedSession.question_id;
    session.duration = selectedSession.duration;
    setSelectedSession(session);
  }
  const handleQuestionChange = (event) => {
    setSelectedSession({ ...selectedSession, question_id: event.target.value });
  }
  const createSession = (event) => {
    fetch(
      `/api/createSession`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            user: username,
            pass: password
          }
        )
      }
    ).then(res => {
      if (res.status === 200) {
        res.json().then(data => {
          onSessionCreated(data);
        });
      } else {
        res.text().then(msg => console.log(msg));
      }
    }).catch(error => {
      console.log(error);
    });
  }
  return (
    <div className="main">
      <div className="sessionlist">

        <select onChange={handleSessionChange}>
          {sessions && sessions.map(session => (
            <option key={session.id} value={session.id}>Session {session.id}</option>
          ))}
        </select>
        <button onClick={createSession}>New Session</button>
      </div>
      <div className="sessiondetails">
        <div>
          <p>Valor de sessions:</p>
          <pre>{JSON.stringify(selectedSession, null, 2)}</pre>
        </div>
        <label>Id:</label>
        <input type="text" readOnly value={selectedSession && selectedSession.id} />
        <label>Duration:</label>
        <input type="text" value={selectedSession && selectedSession.duration || ""} onChange={e => setSelectedSession({ ...selectedSession, duration: e.target.value })} />
        <label>Question:</label>
        <select onChange={handleQuestionChange}>
          {questions && questions.map(question => (
            <option key={question.id} value={question.id}>{question.prompt}</option>
          ))}
        </select>
      </div>
      <div className="startsession" >
        <button>Start</button>
        <input type="text" readOnly />
      </div>
    </div>
  );
}