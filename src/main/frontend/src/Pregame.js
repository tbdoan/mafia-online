import React,  {useState} from 'react'
import EnterNameForm from './components/EnterNameForm'
import PlayerList from './components/PlayerList';
import StartButton from './components/StartButton';
import './App.css'

const Pregame = (props) => {
    const [nameEntered, setNameEntered] = useState(false);
    return (
        <div className='preGame'>
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
                </div>
            }
        </div>
    )
}

export default Pregame;