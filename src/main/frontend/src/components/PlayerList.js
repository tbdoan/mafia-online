import React from 'react';

/**
 * List of Players
 */
const PlayerList = ({players}) => {
  const JustTheList = () => {
    return players.map((player, index) => {
      return (
      <div key={index}>
        <h3>{player.name}</h3>
      </div>
      )
    })
  }
  return (
    <div>
      <h1>Here are your players:</h1>
      <JustTheList />
    </div>
  )
};

export default PlayerList;