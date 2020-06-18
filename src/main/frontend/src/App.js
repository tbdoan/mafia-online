// eslint-disable-next-line
import React, {useState, useEffect} from 'react';
import axios from 'axios'
import SockJS from "sockjs-client"
import {Stomp} from "@stomp/stompjs"

import './App.css';
import EnterNameForm from './components/EnterNameForm'
import PlayerList from './components/PlayerList'

const App = () => {
    const [players, setPlayers] = useState([]);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [stompClient, setStompClient] = useState(null);

    const initialize = (e) => {
        if(typeof myVar !== 'undefined') {
            e.preventDefault();
        }
        //create a new socket connection
        const sock = new SockJS('http://localhost:8080/gs-guide-websocket');
        console.log(Stomp.over(sock));
        setStompClient(Stomp.over(sock));
    }

    const fetchPlayers = () => {
        axios.get("http://localhost:8080/api/v1/player").then(res => {
            setPlayers(res.data);
        });
    }

    useEffect(() => {fetchPlayers()}, []);

    return(
        <div className='App'>
            {name==='' ?
                <EnterNameForm updateName={setName} setPlayers={setPlayers} /> :
                <h1>Your name is: {name}</h1>
            }
            <PlayerList players={players} />

        </div>
    )

}

export default App;
