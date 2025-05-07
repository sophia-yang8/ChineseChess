import { useState, useEffect } from 'react';
import './App.css';
import Board from './board/Board';

function App() {
  // Get the server endpoint from the environment variable
  const serverEndpoint = import.meta.env.VITE_SERVER_ENDPOINT || 'http://localhost:5000';

  // State to store the board state
  const [boardState, setBoardState] = useState(null);

  // Fetch the board state from the server when the component mounts
  useEffect(() => {
    fetch(`${serverEndpoint}/board`)
      .then((response) => response.json())
      .then((data) => {
        setBoardState(data);
      })
      .catch((error) => {
        console.error('Error fetching board state:', error);
      });
  }, [serverEndpoint]); // Dependency array ensures this runs only once

  // Check if the board state is valid
  if (!boardState) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <p>Click on the Vite and React logos to learn more</p>
        <Board boardState={boardState} />
      </div>
    </>
  );
}

export default App;