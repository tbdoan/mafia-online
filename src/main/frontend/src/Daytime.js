import React, {useState, useEffect} from 'react'
import axios from 'axios'
import VoteButtons from './components/VoteButtons'

const Daytime = ({voteResult, players, setPlayers, setGameState, name, stompClient}) => {
    const [target, setTarget] = useState('');
    const [voted, setVoted] = useState(false);

    useEffect(() => {
        if(!voteResult.alive && voteResult.name===name)
            setGameState('dead');
        else if(stompClient != null) {
            const sub = stompClient.subscribe(`/topic/Civilian`, (msg) => {
                sub.unsubscribe();
                let target = JSON.parse(msg.body);
                if(target.role==="Civilian Victory") {
                    setGameState('civwin');
                } else if(target.role==="Mafia Victory") {
                    setGameState('mafwin');
                } else {
                    setTarget(target);
                    axios.get(`http://localhost:8080/api/v1/player/`).then(res => {
                        setPlayers(res.data);
                        if(name===target.name)
                            setTimeout(() => setGameState('dead'), 3000);
                        else
                            setTimeout(() => setGameState('night'), 3000);
                    })
                }
            });
        }
    }, [])

    return(
        <div className='App'>
            <h1>Your name is {name}</h1>
            {voteResult.alive
                ? <h1>Mafia tried to kill {voteResult.name} but they were saved.</h1>
                : <h1>Mafia have killed {voteResult.name} ({voteResult.role})</h1>
            }
            <h1>Who would you like to mob?</h1>
            {target!==''
                ? <h1>The mob has killed {target.name} ({target.role})</h1>
                : voted
                ? <h1>Waiting for others to finish voting...</h1>
                : <VoteButtons players={players}
                    stompClient={stompClient}
                    setVoted={setVoted}
                    role={'Civilian'} />
            }
        </div>
    )

}

export default Daytime;