import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

//default grid w/o blank
const gameGrid = [
  [
    "https://imgur.com/yaFsfz3.png",
    "https://imgur.com/GmJJZzI.png",
    "https://imgur.com/rW2lMG9.png"
  ],
  [
    "https://imgur.com/QosO0sB.png",
    "https://imgur.com/CpQ9tIT.png",
    "https://imgur.com/6ap15iB.png"
  ],
  [
    "https://imgur.com/yG57p3S.png",
    "https://imgur.com/HGDRlhw.png",
    "https://imgur.com/I6vHREl.png"
  ]
];

const blankSpace = [0, gameGrid[0].length - 1];

//blank img 
const blankUrl = "https://i.imgur.com/IGnmVTp.png";

//function to generate winning grid
const gridWithBlank = gameGrid.map((subArray, ind) => {
  if (ind === blankSpace[0]) {
    const sub = subArray.map((x) => x);

    return sub.map((val, i) => {
      if (i === blankSpace[1]) {
        return blankUrl;
      }
      return val;
    });
  }
  return subArray.map((x) => x);
});

//winner prop
const Winner = (props) => {
  return <h2>You won! It took you {props.moves} moves!</h2>;
};

//game board prop
const GameBoard = (props) => {
  return (
    <section id="gameBoard">
      {props.grid.map((arr, arrInd) => {
        return arr.map((val, valInd) => {
          return (
            <div
              className="gameSquare"
              onClick={() => {
                return props.onMove(arrInd, valInd);
              }}
            >
              <img src={val} alt={`Tile ${valInd + 1}`} id={val} />
            </div>
          );
        });
      })}
    </section>
  );
};

//game component
const Game = () => {
  //set default states
  const [grid, setGrid] = React.useState([...gridWithBlank].map((x) => [...x]));
  const [isWin, setIsWin] = React.useState(false);
  const [moveCount, setMoveCount] = React.useState(0);

  //check for winner
  function checkWin(arr1, arr2) {
    console.log("checkWin");
    return arr1.map((x) => x.join("")).join("") ===
      arr2.map((x) => x.join("")).join("")
      ? setIsWin(true)
      : setIsWin(false);
  }

  //move blank left
  function moveBlankLeft(arr, item) {
    console.log("left");
    //find the out element with the item
    const outer = arr.map((x) => x.join("")).findIndex((x) => x.includes(item));
    //found the position of that item
    const inner = [...arr[outer]].findIndex((x) => x === item);
    //if it's at the start return the same arr
    if (inner === 0) {
      return arr;
    }
    //swap the current position of the char with the previous element
    [arr[outer][inner - 1], arr[outer][inner]] = [
      item,
      arr[outer][inner - 1]
    ];
    checkWin(gridWithBlank, arr);
    return arr;
  }

  //move blank right
  function moveBlankRight(arr, item) {
    console.log("right");
    //find the out element with the item
    const outer = arr.map((x) => x.join("")).findIndex((x) => x.includes(item));
    //found the position of that item
    const inner = [...arr[outer]].findIndex((x) => x === item);
    //if it's at the end return the same arr
    if (inner === arr[1].length - 1) {
      return arr;
    }
    //swap the current position of the char with the next element
    [arr[outer][inner], arr[outer][inner + 1]] = [
      arr[outer][inner + 1],
      item
    ];
    //check if game is won
    checkWin(gridWithBlank, arr);
    //return the new modified arr
    return arr;
  }

  //move blank up
  function moveBlankUp(arr, char) {
    console.log("up");
    //index that contains the arr with the char
    const outer = arr.map((x) => x.join("")).findIndex((x) => x.includes(char));
    //if its all at highest position return it back
    if (outer === 0) {
      return arr;
    }
    //it position inside the arr
    const inner = [...arr[outer]].findIndex((x) => x === char);

    //temp variable that hold replaced value
    const temp = arr[outer - 1][inner];
    //replace that temp value with the char
    arr[outer - 1][inner] = char;
    //replace the original char with the temp value
    arr[outer][inner] = temp;
    //check if game is won
    checkWin(gridWithBlank, arr);
    //return modified arr
    return arr;
  }

  //move blank down
  function moveBlankDown(arr, char) {
    console.log("down");
    //index that contains the arr with the char
    const outer = arr.map((x) => x.join("")).findIndex((x) => x.includes(char));
    //if its all at highest position return it back
    if (outer === arr.length - 1) {
      return arr;
    }
    //it position inside the arr
    const inner = [...arr[outer]].findIndex((x) => x === char);

    //temp variable that hold replaced value
    const temp = arr[outer + 1][inner];
    //replace that temp value with the char
    arr[outer + 1][inner] = char;
    //replace the original char with the temp value
    arr[outer][inner] = temp;
    //check if game is won
    checkWin(gridWithBlank, arr);
    //return modified arr
    return arr;
  }

  //shuffle current grid using durstenfeld shuffle algorithm
  const shuffleGrid = () => {
    setIsWin(false);
    const tempFlatGrid = [...grid].map((x) => [...x]).flat();

    for (let i = tempFlatGrid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = tempFlatGrid[i];
      tempFlatGrid[i] = tempFlatGrid[j];
      tempFlatGrid[j] = temp;
    }

    const tempGrid = [];
    while (tempFlatGrid.length) {
      tempGrid.push(tempFlatGrid.splice(0, 3));
    }

    setGrid(tempGrid);
  };

  //reset game
  const resetGame = () => {
    setGrid([...gridWithBlank].map((x) => [...x]));
    setIsWin(false);
    setMoveCount(0);
  };

  //handles clicks
  const handleMove = (arrInd, valInd) => {
    //find indexes of blank (first y then x)
    const blankSubArr = grid.findIndex((x) => x.includes(blankUrl));
    const blankIndex = grid[blankSubArr].indexOf(blankUrl);

    //create copy of current grid
    const newGrid = [...grid].map((x) => [...x]);

    //call corresponding move function depending on indexes of blanks
    if (arrInd === blankSubArr && valInd - blankIndex === 1) {
      //move right
      setGrid([...moveBlankRight(newGrid, blankUrl)].map((x) => x));
      //move counter +1
      setMoveCount(moveCount + 1);
    } else if (arrInd === blankSubArr && valInd - blankIndex === -1) {
      //move left
      setGrid([...moveBlankLeft(newGrid, blankUrl)].map((x) => x));
      //move counter +1
      setMoveCount(moveCount + 1);
    } else if (arrInd !== blankSubArr && valInd === blankIndex) {
      if (arrInd - blankSubArr === 1) {
        //move down
        setGrid([...moveBlankDown(newGrid, blankUrl)].map((x) => x));
        //move counter +1
        setMoveCount(moveCount + 1);
      } else if (arrInd - blankSubArr === -1) {
        //move up
        setGrid([...moveBlankUp(newGrid, blankUrl)].map((x) => x));
        //move counter +1
        setMoveCount(moveCount + 1);
      }
    }
  };

  return (
    <div class="body">
      <header>
        <h1>Manchester City - Shuffle Puzzle</h1>
      </header>
      <main class="body">
        <div>
          <button onClick={() => shuffleGrid()}>Shuffle</button>
          <button onClick={() => resetGame()}>New Game</button>
        </div>
        {isWin ? (

          <Winner moves={moveCount} />
        ) : (
          <GameBoard
            onMove={(arrInd, valInd) => handleMove(arrInd, valInd)}
            grid={grid}
          />
        )}
      </main>
      <footer >
        <span>©<a href="https://daviradprofile.netlify.app" target="_blank">DavidIradukunda</a>. All rights reserved.</span>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);