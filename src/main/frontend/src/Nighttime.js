import React, {useState, useEffect} from 'react'
import axios from 'axios'

import Allies from './components/Allies'
import VoteButtons from './components/VoteButtons'
import Timer from 'react-compound-timer'

const Nighttime = ({players, setPlayers, name, stompClient, setGameState, setVoteResult}) => {
    const [role, setRole] = useState('');
    const [action, setAction] = useState('');
    const [voted, setVoted] = useState(false);
    const [target, setTarget] = useState('');

    useEffect(() => {
        const sub = stompClient.subscribe('/topic/getVoteResults', (msg) => {
            sub.unsubscribe();
            let target = JSON.parse(msg.body);
            if(target.role==="Civilian Victory") {
                setGameState('civwin');
            } else if(target.role==="Mafia Victory") {
                setGameState('mafwin');
            } else {
                setVoteResult(target);
                axios.get('http://localhost:8080/api/v1/player/').then(res => {
                    setPlayers(res.data);
                })
                //waits three seconds until sunrise
                setTimeout(() => {setGameState('day')}, 3000);
            }
        })
        let thisPlayer = players.find(p => {return p.name === name});
        setRole(thisPlayer.role);
    }, []);

    useEffect(() => {
        if(stompClient != null && role!=='') {
            const sub = stompClient.subscribe(`/topic/${role}`, (msg) => {
                sub.unsubscribe();
                setTarget(JSON.parse(msg.body));
                stompClient.send('/app/getVoteResults', {}, '')
            });
        }
        switch(role) {
            case 'Mafia':
                setAction('murder');
                break;
            case 'Nurse':
                setAction('heal');
                break;
            case 'Detective':
                setAction('investigate');
                break;
            default:
                setAction('');
        }
    }, [role]);

    return (
        <div className='App'>
            <h1>Your name is {name}</h1>
            <h1>You are a {role}</h1>
            {role==='Civilian' ?
                <h1>You are sleeping</h1> :
                <div>
                    <h1>Your other {role}s are: </h1>
                    <Allies role={role}
                        name={name}
                        players={players} />
                    <h1>Who would you like to {action}?</h1>
                    {target!==''
                        ? <h1>The {role}s have chosen to {action} {target.name}.
                            {role==='Detective' ? `(${target.role})` : ''}</h1>
                        : voted
                        ? <h1>Waiting for others to finish voting...</h1>
                        : <VoteButtons role={role}
                        players={players}
                        stompClient={stompClient}
                        setVoted={setVoted}/>
                    }
                </div>
            }
        </div>
    )
}
export default Nighttime;