import React, {useState} from 'react';
import axios from 'axios';

/**
 * Allows new player to enter their name
 *
 */
const NameForm = ({players, fetchPlayers, setNameEntered}) => {
  let user = '';
  const [name, setName] = useState('');

  const handleNameInput = (e) => {
    setName(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    user = {
      name: name
    };
    let playerNames = players.map(player => player.name);
    if(!playerNames.includes(name)) {
      axios.post(`http://localhost:8080/api/v1/player/`, user)
      .then(
        fetchPlayers
      ).then(
        setNameEntered(name)
      )
    } else {
      alert("Name already taken");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Your Name:
          <input type="text" onChange={handleNameInput} />
        </label>
        <button type="submit">Enter</button>
      </form>
    </div>
  )
}


export default NameForm;