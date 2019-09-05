export function initState(width, height, coutDownValue) {
  let initStateValue = {
    roomId:"",
    roomName:'',
    gameBoard: [],
    width: width,
    height: height,
    countDown: {
      value: coutDownValue,
      intervalId: -1
    },
    gamePattern: "x",
    result: "",
    emptyCellNum: width * height,
    isWaiting: true, // only for host
    isMyTurn:false
  };
  for (let i = 0; i < height; i++) {
    let gameRow = [];
    for (let j = 0; j < width; j++) {
      let gameCell = {
        pattern: ""
      };
      gameRow.push(gameCell);
    }
    initStateValue.gameBoard.push(gameRow);
  }
  return initStateValue;
}

export function calculateWinningRate(win,lose,draw){
  let rate = win/(win+lose+draw)*100;
  return (win+lose+draw == 0)?0:Math.round(rate*100)/100;
}

function directionResult(gameBoard, x, y, dx, dy, pattern) {
  let countL = 0,
    countR = 0;
  let blockL = false,
    blockR = false;
  for (let i = 1; i <= 5; i++) {
    let x1 = x + i * dx;
    let y1 = y + i * dy;
    if (gameBoard[y1] == undefined || gameBoard[y1][x1] == undefined) {
      blockR = true;
      break;
    } else if (gameBoard[y1][x1].pattern === pattern) {
      countR += 1;
    } else if (gameBoard[y1][x1].pattern != "") {
      blockR = true;
      break;
    } else break;
  }

  for (let i = 1; i <= 5; i++) {
    let x1 = x - i * dx;
    let y1 = y - i * dy;
    if (gameBoard[y1] == undefined || gameBoard[y1][x1] == undefined) {
      blockL = true;
      break;
    } else if (gameBoard[y1][x1].pattern === pattern) {
      countL += 1;
    } else if (gameBoard[y1][x1].pattern != "") {
      blockL = true;
      break;
    } else break;
  }


  if (countL + countR + 1 === 5 && (!blockL || !blockR)) {
    return true;
  }

  return false;
}

function calculateRes(gameBoard, newX, newY, pattern) {
  let horizontalResult = directionResult(gameBoard, newX, newY, 1, 0, pattern);
  let verticallResult = directionResult(gameBoard, newX, newY, 0, 1, pattern);
  let majorDiagonalResult = directionResult(
    gameBoard,
    newX,
    newY,
    1,
    1,
    pattern
  );
  let minorDiagonalResult = directionResult(
    gameBoard,
    newX,
    newY,
    1,
    -1,
    pattern
  );
  return horizontalResult ||
    verticallResult ||
    majorDiagonalResult ||
    minorDiagonalResult
    ? "win"
    : "";
}

export function createNewRandomMove(width, height, gameBoard) {
  let randomMove = { x: 0, y: 0 };
  do {
    randomMove.x = Math.floor(Math.random() * width);
    randomMove.y = Math.floor(Math.random() * height);
  } while (gameBoard[randomMove.y][randomMove.x].pattern != "");
  return randomMove;
}

export function calculateResult(gameBoard, x, y, pattern, emptyCellNum) {
  return emptyCellNum - 1 === 0 ? "draw" : calculateRes(gameBoard, x, y, pattern);
}
