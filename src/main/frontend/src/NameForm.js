import React, {useState} from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'

/**
 * Allows new player to enter their name
 *
 */
const NameForm = ({players, fetchPlayers, setNameEntered}) => {
  let user = '';
  const socket = SockJS('http://localhost:8080/gs-guide-websocket');
  let stompClient = Stomp.over(socket);
  const [name, setName] = useState('');
  const [connected, setConnected] = useState(false);

  const handleNameInput = (e) => {
    setName(e.target.value);
  }
  const connect = () => {
    stompClient.connect({}, (frame) => {
      setConnected(true);
      console.log('Connected: ' + frame);
      stompClient.subscribe(`topic/greetings`, (players) => {
        fetchPlayers();
      });
    });

  }

  const disconnect = () => {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
  }

  const sendName = (e) =>  {
    e.preventDefault();
    let playerNames = players.map(player => player.name);
    if(!playerNames.includes(name)) {
      stompClient.send("/app/hello", {}, JSON.stringify({'name': name}));
      setNameEntered(name)
    } else {
      alert("Name already taken");
    }
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
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <form onSubmit={sendName}>
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