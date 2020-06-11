import React from 'react';

const JustTheList = ({playerList}) => {
  return playerList.map((playerList, index) => {
    return (
    <div key={index}>
      <h3>{playerList.name}</h3>
      <p>{playerList.role}</p>
    </div>
    )
  })
}

/**
 * List of Players
 */
const PlayerList = ({playerList}) => {
  return (
    <div>
      <h1>Here are your players:</h1>
      <JustTheList playerList={playerList} />
    </div>
  )
};

export default PlayerList;