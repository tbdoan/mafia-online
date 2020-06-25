import React from 'react'

const AllVoteOptions = ({players, stompClient, role}) => {
    const vote = (name) => {
        stompClient.send(`/app/${role}`, {}, name);
    }

    let playerNames = players.map((player) => {
        if(player.alive) {
            return(player.name);
        }
    });
    playerNames.sort();
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

export default AllVoteOptions;