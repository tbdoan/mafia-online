import React, {useEffect} from 'react'

const StartButton = ({stompClient, setPlayers, setGameState}) => {

    useEffect(() => {
        if(stompClient != null) {
            const sub = stompClient.subscribe('/topic/startGame', (msg) => {
                const players = JSON.parse(msg.body);
                if(Object.keys(players).length === 0) {
                    alert('Need 6 players to start');
                } else {
                    sub.unsubscribe();
                    setPlayers(JSON.parse(msg.body));
                    stompClient.send('/app/gameState', {}, 'night');
                }
            });
        }
    }, [stompClient])

    const onStart = (e) => {
        e.preventDefault();
        stompClient.send('/app/startGame');
    }

    return (
        <div>
            <button onClick={onStart}>Start</button>
        </div>
    );
}

export default StartButton;