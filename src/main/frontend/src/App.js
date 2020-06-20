// eslint-disable-next-line
import React, {useState, useEffect} from 'react';
import axios from 'axios'
import SockJS from "sockjs-client"
import {Stomp} from "@stomp/stompjs"

import './App.css';
import EnterNameForm from './components/EnterNameForm'
import PlayerList from './components/PlayerList'
import StartButton from './components/StartButton'

const App = () => {
    const [players, setPlayers] = useState([]);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [gameStart, setGameStart] = useState(false);
    const [stompClient, setStompClient] = useState(null);

    const createStompClient = (e) => {
        if(typeof e !== 'undefined') {
            e.preventDefault();
        }
        //create a new socket connection
        const sock = new SockJS('http://localhost:8080/gs-guide-websocket');
        setStompClient(Stomp.over(sock));
    }

    const fetchPlayers = () => {
        axios.get("http://localhost:8080/api/v1/player").then(res => {
            setPlayers(res.data);
        });
    }

    useEffect(() => {
        createStompClient();
        fetchPlayers();
    }, []);

    return(
        <div className='App'>
            {name==='' ?
                <EnterNameForm updateName={setName}
                    players={players}
                    setPlayers={setPlayers}
                    stompClient={stompClient}/> :
                <div>
                    <h1>Your name is: {name}</h1>
                </div>
            }
            {!gameStart ?
                <PlayerList players={players} /> :
                <h1>The Game Has Started!</h1>
            }

           {name !== '' && !gameStart ? <StartButton setGameStart={setGameStart} stompClient={stompClient} /> : <div/>}

        </div>
    )

}

export default App;
