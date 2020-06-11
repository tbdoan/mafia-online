import React from 'react';


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
                <h1>You are sleeping</h1>
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
            return (player.name === name ? <div></div> :
            <div key={index}>
                <h3>{player.name}</h3>
            </div>
            )}
        )
    };

    const vote = () => {

    }
    const VoteOptions = () => {
        return players.map((player, index) => {
            return (
                <div key={index}>
                    <button onClick={vote}>{player.name}</button>
                </div>
            )}
        )
    };

    return(
        <div>
            <h1>Your other {displayedRole}'s are: </h1>
            <JustTheList />
            <h1>Who would you like to {action}?</h1>
            <VoteOptions />
        </div>
    )
}


export default SameRoleList