import React, {useState, useEffect} from 'react';
import PlayerList from './PlayerList'

/**
 * List of Players
 */
const Allies = ({players, role, name}) => {
    const [playerSubset, setPlayerSubset] = useState([]);

    useEffect(() => {
        const playerSubset = players.filter(p => {
            return(p.role === role && p.name !== name && p.alive);
        });
        setPlayerSubset(playerSubset);
    }, [role]);

    return (
        <PlayerList players={playerSubset} />
    )
};

export default Allies;