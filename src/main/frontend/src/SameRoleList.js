import React from 'react';
import axios from 'axios';

/**
 * Displays everyone with displayedRole
 *
 */
const SameRoleList = ({name, players, displayedRole, indexes}) => {

    let playerSubset = [];
    let action = '';
    if(displayedRole === 'Civilian') {
        return(
            <div>
                <h1>You are a Civilian</h1>
                <h3>You are sleeping</h3>
            </div>
        )
    }
    if(displayedRole === 'Mafia') {
        playerSubset = players.slice(0, indexes[0]);
        action = 'murder';
    }
    else if(displayedRole === 'Nurse') {
        playerSubset = players.slice(indexes[0], indexes[1]);
        action = 'heal';
    }
    else if(displayedRole === 'Detective') {
        playerSubset = players.slice(indexes[1], indexes[2]);
        action = 'investigate';
    }

    const JustTheList = () => {
        return playerSubset.map((player, index) => {
            return (player.name === name ? <div key={index}/> :
            <div key={index}>
                <h3>{player.name}</h3>
            </div>
            )}
        )
    };

    const vote = (name) => {
        axios.get(`http://localhost:8080/api/v1/player/${displayedRole}/${name}`).then(res => {
            if(res!=null) {
                console.log(`${displayedRole}'s choice is ${res.name}`)
            }
        })
    }
    const VoteOptions = () => {
        return players.map((player, index) => {
            return (
                <div key={index}>
                    <button onClick={vote(player.name)}>{player.name}</button>
                </div>
            )}
        )
    };

    return(
        <div>
            <h2>Your role is: {displayedRole}</h2>
            <h3>Your other {displayedRole}'s are: </h3>
            <JustTheList />
            <h3>Who would you like to {action}?</h3>
            <VoteOptions />
        </div>
    )
}


export default SameRoleList