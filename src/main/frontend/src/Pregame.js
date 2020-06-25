import React,  {useState} from 'react'
import EnterNameForm from './components/EnterNameForm'
import PlayerList from './components/PlayerList';
import StartButton from './components/StartButton';

const Pregame = (props) => {
    const [nameEntered, setNameEntered] = useState(false);
    return (
        <div className='App'>
            {nameEntered ?
                <div>
                    <h1>Your name is {props.name}</h1>
                    <PlayerList players={props.players} />
                    <StartButton stompClient={props.stompClient}
                            setPlayers={props.setPlayers}
                            start={props.start} />
                </div> :
                <div>
                    <EnterNameForm updateName={props.setName}
                            players={props.players}
                            setPlayers={props.setPlayers}
                            stompClient={props.stompClient}
                            setNameEntered={setNameEntered}
                            />
                    <PlayerList players={props.players} />
                </div>
            }
        </div>
    )
}

export default Pregame;