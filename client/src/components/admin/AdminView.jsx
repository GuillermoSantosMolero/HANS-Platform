import { React, useState, useEffect } from "react";

import Backdrop from '@mui/material/Backdrop';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


import AdminLogin from './AdminLogin.jsx';
import AdminInterface from './AdminInterface.jsx';

export default function AdminView() {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [status, setStatus] = useState(null);
    const [sessions, setSessions] = useState(null);
    const [questions, setQuestions] = useState(null);
    const joinSession = (username, password, status) => {
        setUsername(username);
        setPassword(password);
        console.log(status);
        setStatus(status);
    };
    useEffect(() => {
        if (status != null) {
            fetch(
                `/api/session`,
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
                        setSessions(data);
                    });
                } else {
                    res.text().then(msg => console.log(msg));
                }
            }).catch(error => {
                console.log(error);
            });
            fetch(
                `/api/question`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            ).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        setQuestions(data);
                        console.log(data);
                    });
                } else {
                    res.text().then(msg => console.log(msg));
                }
            }).catch(error => {
                console.log(error);
            });

        }
    }, [status]);
    return (
        <Container component="main" maxWidth="l">
            <Backdrop
                sx={{
                    backgroundColor: 'white',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={status == null}
            >
                <AdminLogin
                    onJoinSession={joinSession}
                />
            </Backdrop>

            <Box
                component="main"
                height='100vh'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <AdminInterface
                    questions={questions}
                    sessions={sessions}
                ></AdminInterface>
            </Box>
        </Container>


    );
}