// eslint-disable-next-line
import React, {useState, useEffect} from 'react';
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

    const [name, setName] = useState('');
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState('pregame');
    const [stompClient, setStompClient] = useState(null);
    const [voteResult, setVoteResult] = useState('voteResult');

    /**
     * creates stompClient on page load
     *
     */
    useEffect(() => {
        const sock = new SockJS('http://localhost:8080/mafia-game-websocket');
        const stompClient = Stomp.over(sock);
        stompClient.connect({}, () => {
            setStompClient(stompClient);
        })
    }, []);

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
    } else if(gameState === 'night') {
        return (
            <Nighttime players={players}
                setPlayers={setPlayers}
                name={name}
                setGameState={setGameState}
                stompClient={stompClient}
                setVoteResult={setVoteResult}
            />
        )
    } else if(gameState === 'day') {
        return (
            <Daytime voteResult={voteResult}
                name={name}
                players={players}
                setPlayers={setPlayers}
                stompClient={stompClient}
                setGameState={setGameState}
            />
        )
    } else if(gameState === 'dead') {
        return (
            <div className='App'>
                <h1> YOU </h1>
                <h1> ARE </h1>
                <h1> DEAD </h1>
            </div>
        )
    } else if(gameState === 'civwin') {
        return (
            <h1>CIVILIANS WIN!</h1>
        )
    } else if(gameState === 'mafwin') {
        return (
            <h1>MAFIA WIN!</h1>
        )
    }
    else {
        return(<div/>);
    }
}

export default App;
