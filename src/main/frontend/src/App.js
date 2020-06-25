// eslint-disable-next-line
import React, {useState, useEffect} from 'react';
import axios from 'axios'
import SockJS from "sockjs-client"
import {Stomp} from "@stomp/stompjs"

import './App.css';
import Pregame from './Pregame'
import Nighttime from './Nighttime'
import Daytime from './Daytime'

const App = () => {
    //TODO: uncomment this later
    /*
    window.addEventListener("beforeunload", function (e) {
        var confirmationMessage = 'It looks like you have been editing something. '
                                + 'If you leave before saving, your changes will be lost.';

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    });
    */

    const [players, setPlayers] = useState([]);
    const [indexes , setIndexes] = useState(null);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [gameState, setGameState] = useState('pregame');
    const [stompClient, setStompClient] = useState(null);
    const [chosenPlayers, setChosenPlayers] = useState({});

    /**
     * creates stompclient
     */
    const createStompClient = (e) => {
        if(typeof e !== 'undefined') {
            e.preventDefault();
        }
        //create a new socket connection
        const sock = new SockJS('http://localhost:8080/gs-guide-websocket');
        setStompClient(Stomp.over(sock));
    }

    /**
     * fetches players (only used in beginning)
     */
    const fetchPlayers = () => {
        axios.get("http://localhost:8080/api/v1/player").then(res => {
            setPlayers(res.data);
        });
    }

    /**
     * runs ONCE on page load
     */
    useEffect(() => {
        createStompClient();
        fetchPlayers();
    }, []);

    useEffect(() => {
        if(indexes !== null) {
            setGameState('night');
            stompClient.subscribe('/topic/getVoted', (msg) => {
                setChosenPlayers(JSON.parse(msg.body));
            });
        }
    }, [indexes]);

    useEffect(()=> {
        if(Object.keys(chosenPlayers).length === 3) {
            setTimeout(() => {setGameState('day')}, 5000);
        }
    }, [chosenPlayers])

    /**
     * runs on game start
     */
    const start = (players) => {
        axios.get(`http://localhost:8080/api/v1/player/${name}`).then( res => {
            setRole(res.data.role);
        });
        const tmp = [0, 0, 0];
        tmp[0] = Math.floor(players.length/3);
        tmp[1] = tmp[0] + Math.floor(players.length/4);
        tmp[2] = tmp[1] + Math.floor(players.length/4);
        setIndexes(tmp);
    }

    if(gameState === 'pregame') {
        return (
            <Pregame name={name}
                    setName={setName}
                    players={players}
                    setPlayers={setPlayers}
                    stompClient={stompClient}
                    setGameState={setGameState}
                    start={start}
            />
        )
    } else if(gameState === 'night') {
        return (
            <Nighttime name={name}
                players={players}
                role={role}
                indexes={indexes}
                stompClient={stompClient}
            />
        )
    } else if(gameState === 'day') {
        return (
            <Daytime setPlayers={setPlayers}
                name={name}
                players={players}
                stompClient={stompClient}
                chosenPlayers={chosenPlayers}
                setGameState={setGameState} />
        )
    }
    else {
        return(<div/>);
    }

}

export default App;
