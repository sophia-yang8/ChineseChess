// Initialize the board with starting positions
export function initialBoardSetup() {
    const board = Array(10)
      .fill(null)
      .map(() => Array(9).fill(null))
  
    // Place red pieces (bottom)
    board[9][0] = { type: "chariot", color: "red" }
    board[9][1] = { type: "horse", color: "red" }
    board[9][2] = { type: "elephant", color: "red" }
    board[9][3] = { type: "advisor", color: "red" }
    board[9][4] = { type: "general", color: "red" }
    board[9][5] = { type: "advisor", color: "red" }
    board[9][6] = { type: "elephant", color: "red" }
    board[9][7] = { type: "horse", color: "red" }
    board[9][8] = { type: "chariot", color: "red" }
    board[7][1] = { type: "cannon", color: "red" }
    board[7][7] = { type: "cannon", color: "red" }
    board[6][0] = { type: "soldier", color: "red" }
    board[6][2] = { type: "soldier", color: "red" }
    board[6][4] = { type: "soldier", color: "red" }
    board[6][6] = { type: "soldier", color: "red" }
    board[6][8] = { type: "soldier", color: "red" }
  
    // Place black pieces (top)
    board[0][0] = { type: "chariot", color: "black" }
    board[0][1] = { type: "horse", color: "black" }
    board[0][2] = { type: "elephant", color: "black" }
    board[0][3] = { type: "advisor", color: "black" }
    board[0][4] = { type: "general", color: "black" }
    board[0][5] = { type: "advisor", color: "black" }
    board[0][6] = { type: "elephant", color: "black" }
    board[0][7] = { type: "horse", color: "black" }
    board[0][8] = { type: "chariot", color: "black" }
    board[2][1] = { type: "cannon", color: "black" }
    board[2][7] = { type: "cannon", color: "black" }
    board[3][0] = { type: "soldier", color: "black" }
    board[3][2] = { type: "soldier", color: "black" }
    board[3][4] = { type: "soldier", color: "black" }
    board[3][6] = { type: "soldier", color: "black" }
    board[3][8] = { type: "soldier", color: "black" }
  
    return board
  }
  
  // Check if a move is valid
  export function canMovePiece(board, fromRow, fromCol, toRow, toCol, currentPlayer) {
    // Basic validation
    if (
      fromRow < 0 ||
      fromRow >= 10 ||
      fromCol < 0 ||
      fromCol >= 9 ||
      toRow < 0 ||
      toRow >= 10 ||
      toCol < 0 ||
      toCol >= 9
    ) {
      return false
    }
  
    const piece = board[fromRow][fromCol]
  
    // Check if there's a piece to move and it belongs to the current player
    if (!piece || piece.color !== currentPlayer) {
      return false
    }
  
    // Check if destination has a piece of the same color
    if (board[toRow][toCol] && board[toRow][toCol]?.color === currentPlayer) {
      return false
    }
  
    // Implement piece-specific movement rules
    switch (piece.type) {
      case "general":
        return canMoveGeneral(board, fromRow, fromCol, toRow, toCol, piece.color)
      case "advisor":
        return canMoveAdvisor(board, fromRow, fromCol, toRow, toCol, piece.color)
      case "elephant":
        return canMoveElephant(board, fromRow, fromCol, toRow, toCol, piece.color)
      case "horse":
        return canMoveHorse(board, fromRow, fromCol, toRow, toCol)
      case "chariot":
        return canMoveChariot(board, fromRow, fromCol, toRow, toCol)
      case "cannon":
        return canMoveCannon(board, fromRow, fromCol, toRow, toCol)
      case "soldier":
        return canMoveSoldier(board, fromRow, fromCol, toRow, toCol, piece.color)
      default:
        return false
    }
  }
  
  // General (King) movement
  function canMoveGeneral(board, fromRow, fromCol, toRow, toCol, color) {
    // General can only move within the palace (3x3 grid)
    const palaceColStart = 3
    const palaceColEnd = 5
  
    const palaceRowStart = color === "red" ? 7 : 0
    const palaceRowEnd = color === "red" ? 9 : 2
  
    if (toCol < palaceColStart || toCol > palaceColEnd || toRow < palaceRowStart || toRow > palaceRowEnd) {
      return false
    }
  
    // General can only move one step horizontally or vertically
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)
  
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
  }
  
  // Advisor (Minister) movement
  function canMoveAdvisor(board, fromRow, fromCol, toRow, toCol, color) {
    // Advisor can only move within the palace (3x3 grid)
    const palaceColStart = 3
    const palaceColEnd = 5
  
    const palaceRowStart = color === "red" ? 7 : 0
    const palaceRowEnd = color === "red" ? 9 : 2
  
    if (toCol < palaceColStart || toCol > palaceColEnd || toRow < palaceRowStart || toRow > palaceRowEnd) {
      return false
    }
  
    // Advisor can only move one step diagonally
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)
  
    return rowDiff === 1 && colDiff === 1
  }
  
  // Elephant movement
  function canMoveElephant(board, fromRow, fromCol, toRow, toCol, color) {
    // Elephant cannot cross the river
    const riverBoundary = 5 // Middle of the board
  
    if ((color === "red" && toRow < riverBoundary) || (color === "black" && toRow >= riverBoundary)) {
      return false
    }
  
    // Elephant moves exactly two steps diagonally
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)
  
    if (rowDiff !== 2 || colDiff !== 2) {
      return false
    }
  
    // Check if there's a piece blocking the elephant's path
    const midRow = (fromRow + toRow) / 2
    const midCol = (fromCol + toCol) / 2
  
    return board[midRow][midCol] === null
  }
  
  // Horse movement
  function canMoveHorse(board, fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)
  
    // Horse moves in an L shape: 2 steps in one direction, 1 step in the perpendicular direction
    if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
      return false
    }
  
    // Check if there's a piece blocking the horse's path
    let midRow = fromRow
    let midCol = fromCol
  
    if (rowDiff === 2) {
      midRow = fromRow + (toRow > fromRow ? 1 : -1)
    } else {
      midCol = fromCol + (toCol > fromCol ? 1 : -1)
    }
  
    return board[midRow][midCol] === null
  }
  
  // Chariot (Rook) movement
  function canMoveChariot(board, fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)
  
    // Chariot can only move horizontally or vertically
    if (rowDiff > 0 && colDiff > 0) {
      return false
    }
  
    // Check if there are any pieces in the path
    if (rowDiff > 0) {
      const step = toRow > fromRow ? 1 : -1
      for (let r = fromRow + step; r !== toRow; r += step) {
        if (board[r][fromCol] !== null) {
          return false
        }
      }
    } else {
      const step = toCol > fromCol ? 1 : -1
      for (let c = fromCol + step; c !== toCol; c += step) {
        if (board[fromRow][c] !== null) {
          return false
        }
      }
    }
  
    return true
  }
  
  // Cannon movement
  function canMoveCannon(board, fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)
  
    // Cannon can only move horizontally or vertically
    if (rowDiff > 0 && colDiff > 0) {
      return false
    }
  
    // Count pieces in the path
    let piecesInPath = 0
  
    if (rowDiff > 0) {
      const step = toRow > fromRow ? 1 : -1
      for (let r = fromRow + step; r !== toRow; r += step) {
        if (board[r][fromCol] !== null) {
          piecesInPath++
        }
      }
    } else {
      const step = toCol > fromCol ? 1 : -1
      for (let c = fromCol + step; c !== toCol; c += step) {
        if (board[fromRow][c] !== null) {
          piecesInPath++
        }
      }
    }
  
    // Cannon needs exactly one piece to jump over when capturing
    if (board[toRow][toCol] !== null) {
      return piecesInPath === 1
    }
  
    // Cannon needs no pieces in the path when not capturing
    return piecesInPath === 0
  }
  
  // Soldier (Pawn) movement
  function canMoveSoldier(board, fromRow, fromCol, toRow, toCol, color) {
    const rowDiff = toRow - fromRow
    const colDiff = Math.abs(toCol - fromCol)
  
    // Soldier can only move forward before crossing the river
    const riverBoundary = 5 // Middle of the board
    const hasPassedRiver = (color === "red" && fromRow < riverBoundary) || (color === "black" && fromRow >= riverBoundary)
  
    // Determine forward direction based on color
    const forwardDir = color === "red" ? -1 : 1
  
    if (hasPassedRiver) {
      // After crossing the river, soldier can move forward or sideways
      if (rowDiff === forwardDir && colDiff === 0) {
        return true // Moving forward
      }
  
      if (rowDiff === 0 && colDiff === 1) {
        return true // Moving sideways
      }
    } else {
      // Before crossing the river, soldier can only move forward
      return rowDiff === forwardDir && colDiff === 0
    }
  
    return false
  }
  