import React,  {useState, useEffect} from 'react'
import EnterNameForm from './components/EnterNameForm'
import PlayerList from './components/PlayerList';
import StartButton from './components/StartButton';

const Pregame = (props) => {
    const [nameEntered, setNameEntered] = useState(false);

    useEffect(() => {
        if(props.stompClient != null) {
            const sub = props.stompClient.subscribe('/topic/updatePlayers', (msg) => {
                props.setPlayers(JSON.parse(msg.body));
            });
        }
    }, [props.stompClient])

    return (
        <div className='App'>
            {!nameEntered ?
                <div>
                    <h1>This is Mafia.</h1>
                    <EnterNameForm stompClient={props.stompClient}
                        setName={props.setName}
                        setNameEntered={setNameEntered}
                        />
                </div> :
                <div>
                    <h1>Your name is {props.name}</h1>
                    <StartButton setGameState={props.setGameState}
                        stompClient={props.stompClient}
                        setPlayers={props.setPlayers}/>
                    <PlayerList players={props.players} />
                </div>
            }
        </div>
    )
}

export default Pregame;