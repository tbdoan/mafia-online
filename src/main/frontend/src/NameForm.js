import React, {useState} from 'react';
import axios from 'axios';

/**
 * Allows new player to enter their name
 *
 */
const NameForm = ({fetchPlayers, setNameEntered}) => {
  let user = '';
  const [name, setName] = useState('');

  const handleNameInput = (e) => {
    setName(e.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    user = {
      name: name
    };
    axios.post(`http://localhost:8080/api/v1/player/`, user)
    .then(
      fetchPlayers
    ).then(
      setNameEntered(name)
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Player Name:
          <input type="text" onChange={handleNameInput} />
        </label>
        <button type="submit">Add</button>
      </form>
    </div>
  )
}


export default NameForm;