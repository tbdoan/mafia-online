import React from 'react';

const JustTheList = ({playerList}) => {
    return playerList.map((playerList, index) => {
        return (
        <div key={index}>
            <h3>{playerList.name}</h3>
        </div>
        )
    })
}
/**
 * Displays everyone with displayedRole
 *
 */
const SameRoleList = ({players, displayedRole, indexes}) => {

    let playerSubset = [];
    if(displayedRole === 'Civilian') {
        return(
            <div>
                <h1>You are sleeping</h1>
            </div>
        )
    }
    if(displayedRole === 'Mafia') {
        playerSubset = players.slice(0, indexes[0])
    }
    else if(displayedRole === 'Nurse') {
        playerSubset = players.slice(indexes[0], indexes[1])
    }
    else if(displayedRole === 'Detective') {
        playerSubset = players.slice(indexes[1], indexes[2])
    }

    return(
        <div>
            <h1>Your {displayedRole}'s are: </h1>
            <JustTheList playerList={playerSubset} />
        </div>
    )
}


export default SameRoleList