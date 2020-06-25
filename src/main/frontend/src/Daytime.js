import React, {useState, useEffect} from 'react'
import axios from 'axios'

import Storyline from './components/Storyline'
import AllVoteOptions from './components/AllVoteOptions'

const Daytime = (props) => {
    const [playerStatusUpdated, setPlayerStatusUpdated] = useState(false);
    const [chosenPlayerName, setChosenPlayerName] = useState('');
    const [chosenPlayerRole, setChosenPlayerRole] = useState('');

    useEffect(() => {
        if(props.stompClient != null) {
            const subscription = props.stompClient.subscribe(`/topic/Civilian`, (msg) => {
                let body = JSON.parse(msg.body);
                setChosenPlayerName(body.name);
                setChosenPlayerRole(body.role);
                let config = {
                    headers: {
                      'action': 'update-status',
                    }
                  }
                axios.put(`http://localhost:8080/api/v1/player/${chosenPlayerName}`, '', config)
                    .then((res) => {
                props.setPlayers(res.data);
                })
                subscription.unsubscribe();
            });
        }
    }, [])
    if(props.name===props.chosenPlayers.Mafia.name && props.chosenPlayers.Mafia.name!==props.chosenPlayers.Nurse.name) {
        return <h1 className='App'>You are dead</h1>
    } else {
        return(
            <div className='App'>
                <Storyline setPlayers={props.setPlayers}
                    chosenPlayers={props.chosenPlayers}
                    setPlayerStatusUpdated={setPlayerStatusUpdated}/>
                <h1>Who would you like to mob?</h1>
                {playerStatusUpdated && chosenPlayerName === '' ?
                <AllVoteOptions players={props.players} stompClient={props.stompClient} role={'Civilian'} /> :
                <div/> }

                {chosenPlayerName !== '' ?
                    <div>
                        <h1>The mob has killed {chosenPlayerName} ({chosenPlayerRole})</h1>
                    </div> :
                    <div/>
                }


            </div>
        )
    }
}

export default Daytime;