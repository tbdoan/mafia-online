import React, {useState, useEffect} from 'react'

const EnterNameForm = ({updateName, players, setPlayers, stompClient,setNameEntered}) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if(stompClient != null) {
            stompClient.connect({}, () => {
                const subscription = stompClient.subscribe('/topic/enterName', (msg) => {
                    let players = JSON.parse(msg.body);
                    setPlayers(players);
                });
            })
        }
    }, [stompClient])

    const handleNameInput = (e) => {
        setName(e.target.value);
    }

    const handleSubmit = (e) => {
        let playerNames = players.map(player => player.name);
        if(name==='' || playerNames.includes(name)) {
            alert('Invalid Name.'); return;
        }
        e.preventDefault();
        updateName(name);
        stompClient.send('/app/enterName', {}, JSON.stringify({name : name}));
        setNameEntered(true);
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                Enter Your Name:
                <input type="text" onChange={handleNameInput} />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default EnterNameForm;