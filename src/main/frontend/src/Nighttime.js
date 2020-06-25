import React from 'react'
import VoteOptions from './components/VoteOptions'

const Nighttime = (props) => {
    return (
        <div className='App'>
            <h1>Your name is {props.name}</h1>
            <VoteOptions name={props.name}
                players={props.players}
                role={props.role}
                indexes={props.indexes}
                stompClient={props.stompClient}
                updateChosenPlayers={props.updateChosenPlayers} />
        </div>
    )
}
export default Nighttime;