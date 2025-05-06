import './App.css';

import React, {useState} from 'react';

var winner = "";
const RenderBox = ({index, updater, box}) => {
  return(
    <button disabled = {winner === "" ? false : true} className='box' onClick={() => updater(index)}>{box[index[0]][index[1]]}</button>
  );
}

function announceWinner(states){
  let winningPoss = [
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]]
  ];

  for(let i=0; i<winningPoss.length;i++){
    let t = winningPoss[i][0];
    let player = states[t[0]][t[1]];
    let flag = true;
    for(let j=0; j<winningPoss[i].length;j++){
      let index = winningPoss[i][j];
      if(states[index[0]][index[1]] !== player){
        flag = false;
      }
    }
    if(flag){
      return player;
    }
  }
  return "";
}

export default function App() {
  let [states, setStates] = useState([["","",""],["","",""],["","",""]])
  let [flagX, setFlagX] = useState(true)
  let [ history, setHistory ]= useState([states])
  let newStates;
  //console.log(history); 
  function updateStates(index){
    setStates((prevStates) => {
      newStates = prevStates.map((row,rowIndex) => 
        row.map((cell,cellIndex)=>{
          if( (rowIndex === index[0] && cellIndex === index[1]) && cell === "" ){
            return flagX ? "X" : "O";
          }else{
            return cell;
          }
        })
     )
      winner = winner === "" ? announceWinner(newStates) : winner;
      return newStates;
    });
    setFlagX(prevFlag => !prevFlag);
    setHistory((prevHistory) => [...prevHistory, newStates])
  }
  
  function jumpTo(step){
    setStates(history[step]);
    setHistory((prevHistory) => prevHistory.slice(0,step+1));
  }

  const moveHistory = history.map((mH,stepNo) => {
    return <div key={stepNo} onClick={() => jumpTo(stepNo)}>
      {"step No: "+stepNo}
    </div>
  });

  const grid = states.map((row,rowIndex) => {
    return <div key={`row-${rowIndex}`} className='board-row'>
    {
    row.map((cell, cellIndex) => {
      return <RenderBox key={`cell-${cellIndex}`} index = { [rowIndex, cellIndex] } updater={updateStates} box={states} />
    })
    }
    </div>
  })
  return (
    <div className="App">
      <div>
      <p>Next Move:  {flagX ? "X" : "O"}</p>
      <p>Winner is: {winner==="" ? "Can't Decide" : winner}</p>
      {grid}
      </div>
      <div>
      {moveHistory}
      </div>
    </div>
  );
}

//export default App;
