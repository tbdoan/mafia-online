// eslint-disable-next-line
import React, {useState, useEffect} from 'react';
import SockJS from "sockjs-client"
import {Stomp} from "@stomp/stompjs"
import axios from 'axios'

import './App.css';
import Pregame from './Pregame'
import Nighttime from './Nighttime'
import Daytime from './Daytime'

const App = () => {
    /**
     * alerts user when they leave the page
     */
    useEffect(() => {
        window.addEventListener("beforeunload", function (e) {
            var confirmationMessage = 'It looks like you have been editing something. '
                                    + 'If you leave before saving, your changes will be lost.';

            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
        })
    }, []);

    const [name, setName] = useState('');
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState('pregame');
    const [stompClient, setStompClient] = useState(null);
    const [voteResult, setVoteResult] = useState('voteResult');

    /**
     * creates stompClient on page load
     */
    useEffect(() => {
        const sock = new SockJS('http://localhost:8080/mafia-game-websocket');
        const stompClient = Stomp.over(sock);
        axios.get('http://localhost:8080/api/v1/player/gameState').then(res => {
            console.log(res.data);
            if(res.data !== 'pregame') {
                setGameState('started');
            } else {
                stompClient.connect({}, () => {
                    setStompClient(stompClient);
                    const sub = stompClient.subscribe('/topic/gameState', (msg) => {
                        if(msg.body==='dead') {
                            sub.unsubscribe();
                        }
                        setGameState(msg.body);
                    });
                });
            }
        })
    }, []);

    /**
     * Five possible stages for the game
     */
    // What players see when they load in
    if(gameState === 'pregame') {
        return (
            <Pregame name={name}
                setName={setName}
                players={players}
                setPlayers={setPlayers}
                setGameState={setGameState}
                stompClient={stompClient}
            />
        )
    }
    // After 'Start' button is pressed
    else if(gameState === 'night') {
        return (
            <Nighttime players={players}
                setPlayers={setPlayers}
                name={name}
                setGameState={setGameState}
                stompClient={stompClient}
                setVoteResult={setVoteResult}
            />
        )
    }
    // After Mafia, Detective, and Nurse have voted
    else if(gameState === 'day') {
        return (
            <Daytime voteResult={voteResult}
                name={name}
                players={players}
                setPlayers={setPlayers}
                stompClient={stompClient}
                setGameState={setGameState}
            />
        )
    }
    // After mob has decided to kill someone
    else if(gameState === 'dead') {
        return (
            <div className='App'>
                <h1> YOU </h1>
                <h1> ARE </h1>
                <h1> DEAD </h1>
            </div>
        )
    }
    // If all Mafia are dead, game ends
    else if(gameState === 'civwin') {
        return (
            <h1 className='App'>CIVILIANS WIN!</h1>
        )
    }
    // If all Civilians die
    else if(gameState === 'mafwin') {
        return (
            <h1 className='App'>MAFIA WIN!</h1>
        )
    }
    else {
        return (
            <h1 className='App'>Game has already started.</h1>
        )
    }
}

export default App;