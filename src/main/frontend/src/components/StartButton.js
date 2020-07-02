import React, {useEffect} from 'react'

const StartButton = ({stompClient, setPlayers, start}) => {

    useEffect(() => {
        if(stompClient != null) {
            stompClient.connect({}, () => {});
            const subscription = stompClient.subscribe('/topic/startGame', (msg) => {
                setPlayers(JSON.parse(msg.body));
                start(JSON.parse(msg.body));
                subscription.unsubscribe();
            });
        }
    }, [stompClient])

    const onStart = (e) => {
        e.preventDefault();
        stompClient.send('/app/startGame', {}, '');
    }
    return (
        <div>
            <button onClick={onStart}>Start</button>
        </div>
    );
}

export default StartButton;
