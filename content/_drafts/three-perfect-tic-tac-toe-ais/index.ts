function pickMoveIter(board, token): number {
  if (isWinner(board, token)) {
    return 1;
  } else if (isWinner(board, otherToken(token))) {
    return -1;
  } else if (getOpenMoves(board).length === 0) {
    return 0;
  }

  const scores = getOpenMoves(board).map(m =>
    pickMoveIter(makeMove(board, m, token), otherToken(token))
  );
  console.log("scores", scores);
  console.log("best score", Math.max(...scores));
  return Math.max(...scores);
}

function pickMove(board, token): [number, number] {
  let bestScore = -1000000;
  let bestMove = null;
  for (const move of getOpenMoves(board)) {
    const newScore = pickMoveIter(
      makeMove(board, move, token),
      otherToken(token)
    );
    console.log("move", move, newScore);
    if (newScore > bestScore) {
      bestMove = move;
      bestScore = newScore;
    }
  }
  return bestMove;
}

function otherToken(token) {
  return token === "X" ? "X" : "O";
}

function isWinner(board, token) {
  for (let row = 0; row < board.length; row++) {
    if (
      board[row][0] === board[row][1] &&
      board[row][1] === board[row][2] &&
      board[row][0] === token
    ) {
      return true;
    }
  }

  for (let col = 0; col < board.length; col++) {
    if (
      board[0][col] === board[1][col] &&
      board[1][col] === board[2][col] &&
      board[2][col] === token
    ) {
      return true;
    }
  }

  if (
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2] &&
    board[1][1] === token
  ) {
    return true;
  }

  if (
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0] &&
    board[1][1] === token
  ) {
    return true;
  }

  return false;
}

function copyBoard(board) {
  const newBoard = [];
  for (let row = 0; row < board.length; row++) {
    const newRow = [];
    for (let col = 0; col < board[row].length; col++) {
      newRow.push(board[row][col]);
    }
    newBoard.push(newRow);
  }
  return newBoard;
}

function makeMove(board, move, token) {
  const newBoard = copyBoard(board);
  newBoard[move[0]][move[1]] = token;
  return newBoard;
}

function makeBoard() {
  return [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]];
}

function getOpenMoves(board) {
  const moves = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === "-") {
        moves.push([row, col]);
      }
    }
  }
  return moves;
}

const board = makeBoard();
console.log(pickMove(board, "X"));
