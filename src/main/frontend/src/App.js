// eslint-disable-next-line
import React, {useState, useEffect} from 'react';
import './App.css';
import NameForm from './NameForm';
import PlayerList from './PlayerList';
import SameRoleList from './SameRoleList';
import axios from "axios";

function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [gameStart, setGameStart] = useState(false);
  const [indexes, setIndexes] = useState([]);

  const fetchPlayers = () => {
    axios.get("http://localhost:8080/api/v1/player").then(res => {
      setPlayers(res.data);
    })
  }

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/player").then(res => {
      setPlayers(res.data);
    })
  }, [])

  

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
      setGameStart(true);
    })
  };

  const Message = () => {
    return (
      <div>
        <h1>Your name is: {name} </h1>
      </div>
    )
  }


  //TODO: Make the Start Game button disappear once clicked
  return (
    <div className="App">
      {name==='' ?
        <div>
          <NameForm players={players} fetchPlayers={fetchPlayers} setNameEntered={setName}/>
        </div>
        :
        <div>
          <Message />
        </div>
      }
      {!gameStart ?
        <div>
          <PlayerList playerList={players} />
        </div> :
        <SameRoleList name={name} players={players} displayedRole={role} indexes={indexes}/>
      }
      {name !=='' && !gameStart ? <button onClick={start}>Start Game</button> : <div/>}

    </div>
  );
}

export default App;
