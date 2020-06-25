import React from 'react'
import axios from 'axios'

const Storyline = ({chosenPlayers, setPlayerStatusUpdated, setPlayers}) => {
    const chosenName = chosenPlayers.Mafia.name;
    if(chosenName === chosenPlayers.Nurse.name) {
        setPlayerStatusUpdated(true);
        return (
            <h1>Mafia tried to kill {chosenName} but they were saved.</h1>
        )
    } else {
        let config = {
            headers: {
              'action': 'update-status',
            }
          }
        axios.put(`http://localhost:8080/api/v1/player/${chosenName}`, '', config)
            .then((res) => {
                setPlayers(res.data);
                setPlayerStatusUpdated(true)
            })
        return (
            <div>
                <h1>Mafia have killed {chosenName}</h1>
                <h2>{chosenName} was a {chosenPlayers.Mafia.role}</h2>
            </div>
        )
    }
}

export default Storyline