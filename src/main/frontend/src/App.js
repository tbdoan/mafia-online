// eslint-disable-next-line
import React, {useState, useEffect} from 'react';
import './App.css';
import NameForm from './NameForm';
import PlayerList from './PlayerList';
import SameRoleList from './SameRoleList';
import axios from "axios";

const useConstructor = ( callBack = () => {} ) => {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);
  if (hasBeenCalled) return;
  callBack();
  setHasBeenCalled(true);
}

function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [gameStart, setGameStart] = useState(true);
  const [indexes, setIndexes] = useState([]);

  //Loads list of players when the page is loaded
  useConstructor(() => {
    axios.get("http://localhost:8080/api/v1/player").then(res => {
      setPlayers(res.data);
   })
  });



  const fetchPlayers = () => {
    axios.get("http://localhost:8080/api/v1/player").then(res => {
      setPlayers(res.data);
    })
  }

  /**
   * Starts the game. Randomly assigns roles to players and sets your role.
   */
  const start = async () => {
    axios.get("http://localhost:8080/api/v1/player", {'headers': {"action":"assign-roles"} }).then( (res) => {
      axios.get(`http://localhost:8080/api/v1/player/${name}`).then( res => {
        setRole(res.data.role);
      })
      setPlayers(res.data);
      const tmp = [0, 0, 0];
      tmp[0] = Math.floor(players.length/3);
      tmp[1] = tmp[0] + Math.floor(players.length/4);
      tmp[2] = tmp[1] + Math.floor(players.length/4);
      setIndexes(tmp);
      setGameStart(false);
    })
  };

  const Message = () => {
    return (
      <div>
        <h1>Your name is: {name} </h1>
        <h2>Your role is: {role}</h2>
      </div>
    )
  }


  //TODO: Make the Start Game button disappear once clicked
  return (
    <div className="App">
      {name==='' ?
        <div>
          <NameForm fetchPlayers={fetchPlayers} setNameEntered={setName}/>
        </div>
        : <Message />
      }
      {gameStart ?
        <PlayerList playerList={players} /> :
        <SameRoleList name={name} players={players} displayedRole={role} indexes={indexes}/>
      }
      <button onClick={start}>Start Game</button>
    </div>
  );
}

export default App;
