"use client"

import { useState } from "react"
import { Piece } from "./Piece"
import { initialBoardSetup, canMovePiece } from "./Logic"

function Board() {
  const [board, setBoard] = useState(initialBoardSetup())
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState("red")
  const [moveHistory, setMoveHistory] = useState([])

  // Board dimensions
  const rows = 10
  const cols = 9

  // Handle piece selection and movement
  const handleSquareClick = (row, col) => {
    // If no piece is selected and the square has a piece of the current player's color
    if (!selectedPiece && board[row][col] && board[row][col].color === currentPlayer) {
      setSelectedPiece({ row, col })
      return
    }

    // If a piece is already selected
    if (selectedPiece) {
      // If clicking on the same piece, deselect it
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null)
        return
      }

      // If clicking on another piece of the same color, select that piece instead
      if (board[row][col] && board[row][col].color === currentPlayer) {
        setSelectedPiece({ row, col })
        return
      }

      // Try to move the selected piece
      if (canMovePiece(board, selectedPiece.row, selectedPiece.col, row, col, currentPlayer)) {
        const newBoard = [...board.map((row) => [...row])]
        const movingPiece = newBoard[selectedPiece.row][selectedPiece.col]

        // Record the move
        const moveNotation = `${movingPiece.type} ${String.fromCharCode(97 + selectedPiece.col)}${selectedPiece.row} → ${String.fromCharCode(97 + col)}${row}`
        setMoveHistory([...moveHistory, moveNotation])

        // Move the piece
        newBoard[row][col] = movingPiece
        newBoard[selectedPiece.row][selectedPiece.col] = null

        setBoard(newBoard)
        setSelectedPiece(null)
        setCurrentPlayer(currentPlayer === "red" ? "black" : "red")
      }
    }
  }

  // Render the board grid
  const renderBoard = () => {
    const squares = []

    // Create the board grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col

        // Check if this is a valid move for the selected piece
        const isValidMove = selectedPiece
          ? canMovePiece(board, selectedPiece.row, selectedPiece.col, row, col, currentPlayer)
          : false

        squares.push(
          <div
            key={`${row}-${col}`}
            className={`relative border border-gray-700 ${
              isSelected ? "bg-yellow-200 dark:bg-yellow-800" : isValidMove ? "bg-green-100 dark:bg-green-900" : ""
            }`}
            onClick={() => handleSquareClick(row, col)}
            style={{
              width: "11.11%",
              paddingBottom: "10%",
              boxSizing: "border-box",
            }}
          >
            {/* Draw the piece if there is one */}
            {board[row][col] && <Piece type={board[row][col].type} color={board[row][col].color} />}

            {/* Position labels */}
            {col === 0 && (
              <span className="absolute -left-6 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 dark:text-gray-400">
                {10 - row}
              </span>
            )}
            {row === 9 && (
              <span className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400">
                {String.fromCharCode(97 + col)}
              </span>
            )}
          </div>,
        )
      }
    }

    return squares
  }

  return (
    <div className="mb-8">
      <div className="relative bg-amber-50 dark:bg-amber-950 border-2 border-gray-800 rounded-lg p-4 mx-auto max-w-3xl">
        <div className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
          Current Player:{" "}
          <span className={currentPlayer === "red" ? "text-red-600" : "text-gray-900 dark:text-gray-300"}>
            {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}
          </span>
        </div>

        <div className="relative" style={{ paddingLeft: "24px", paddingBottom: "24px" }}>
          <div className="flex flex-wrap" style={{ width: "100%" }}>
            {renderBoard()}
          </div>

          {/* Draw the river */}
          <div className="absolute top-[45%] left-0 w-full h-[10%] bg-blue-100 dark:bg-blue-900 opacity-30 z-0 flex items-center justify-center">
            <span className="text-blue-800 dark:text-blue-200 font-semibold">River</span>
          </div>

          {/* Draw the palace lines */}
          <div className="absolute top-[0%] left-[33.33%] w-[33.33%] h-[30%] border-2 border-gray-700 opacity-50 z-0"></div>
          <div className="absolute bottom-[0%] left-[33.33%] w-[33.33%] h-[30%] border-2 border-gray-700 opacity-50 z-0"></div>
        </div>
      </div>
    </div>
  )
}

export default Board