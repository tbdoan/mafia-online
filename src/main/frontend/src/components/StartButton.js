import React, {useEffect} from 'react'

const StartButton = ({stompClient, setPlayers, setGameState}) => {

    useEffect(() => {
        if(stompClient != null) {
            const sub = stompClient.subscribe('/topic/startGame', (msg) => {
                sub.unsubscribe();
                setPlayers(JSON.parse(msg.body));
                setGameState('night');
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
