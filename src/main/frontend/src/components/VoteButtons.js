import React from 'react'

const VoteButtons = ({players, stompClient, role, setVoted}) => {
    const vote = (name) => {
        setVoted(true);
        stompClient.send(`/app/${role}`, {}, name);
    }

    // eslint-disable-next-line
    let playerNames = players.map((player) => {
        if(player.alive)
            return(player.name);
    });
    playerNames.sort();

    // eslint-disable-next-line
    return playerNames.map((playerName, index) => {
        if(typeof playerName !== 'undefined') {
            return (
                <div key={index}>
                    <button onClick={() => {vote(playerName)}}>{playerName}</button>
                </div>
            )}
        }
    )
}

export default VoteButtons;