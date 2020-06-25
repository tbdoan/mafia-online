import React, { useEffect, useState } from 'react'

import AllVoteOptions from './AllVoteOptions'

const VoteOptions = ({name, players, role, indexes, stompClient}) => {
    let playerSubset = [];
    let action = '';
    let [chosenPlayer, setChosenPlayer] = useState('');
    let [chosenPlayerRole, setChosenPlayerRole] = useState('')

    useEffect(() => {
        if(stompClient != null && role!=='') {
            const subscription = stompClient.subscribe(`/topic/${role}`, (msg) => {
                let body = JSON.parse(msg.body);
                setChosenPlayer(body.name);
                setChosenPlayerRole(body.role);
                stompClient.send('/app/getVoted', {}, '')
                subscription.unsubscribe();
            });
        }
    }, [role])

    if(role === 'Civilian') {
        return(
            <div>
                <h1>You are a Civilian</h1>
                <h3>You are sleeping</h3>
            </div>
        )
    }
    else if(role === 'Mafia') {
        playerSubset = players.slice(0, indexes[0]);
        action = 'murder';
    }
    else if(role === 'Nurse') {
        playerSubset = players.slice(indexes[0], indexes[1]);
        action = 'heal';
    }
    else if(role === 'Detective') {
        playerSubset = players.slice(indexes[1], indexes[2]);
        action = 'investigate';
    }

    const Allies = () => {
        return playerSubset.map((player, index) => {
            return (player.name === name ? <div key={index}/> :
            <div key={index}>
                <h3>{player.name}</h3>
            </div>
            )}
        )
    }

    const ChosenMessage = () => {
        if(role==='Detective') {
            return (
                <div>
                    <h3>The {role}s have chosen to {action} {chosenPlayer} ({chosenPlayerRole})</h3>
                </div>
            )
        } else {
            return (
                <div>
                    <h3>The {role}s have chosen to {action} {chosenPlayer}</h3>
                </div>
            )
        }
    }

    return(
        <div>
            <h2>Your role is: {role}</h2>
            <h3>Your other {role}s are: </h3>
            <Allies/>
            <h1> Who would you like to {action}?</h1>
            {chosenPlayer==='' ? <AllVoteOptions players={players} stompClient={stompClient} role={role}/> : <ChosenMessage/>}
        </div>
    )
}

export default VoteOptions;