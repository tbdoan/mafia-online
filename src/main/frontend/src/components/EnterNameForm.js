import React, {useState} from 'react'
import axios from 'axios'

const EnterNameForm = ({setName, stompClient, setNameEntered}) => {
    const [localName, setLocalName] = useState('');

    const handleNameInput = (e) => {
        setLocalName(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8080/api/v1/player/${localName}`).then(res => {
            if(res.data === 0) {
                setName(localName);
                stompClient.send('/app/updatePlayers');
                setNameEntered(true);
                //send a message to stompClient
            } else {
                alert('Invalid Name.');
            }
        })
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