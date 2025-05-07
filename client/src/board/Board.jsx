import React from "react";
import "./Board.css"; // Import the CSS file for styling

const validateBoardState = (boardState) => {
  if (!boardState) {
    throw new Error("Invalid board: Board state is null or undefined.");
  }
  // Ensure the board has 10 rows and each row has 9 cells
  const rows = boardState["board"];
  if (rows.length !== 10) {
    throw new Error(`Invalid board: Expected 10 rows, but got ${rows.length}.`);
  }
  rows.forEach((row, rowIndex) => {
    if (row.length !== 9) {
      throw new Error(`Invalid board: Row ${rowIndex} has ${row.length} cells instead of 9.`);
    }
  });
};

const renderBoard = (boardState, handleCellClick) => {
  try {
    validateBoardState(boardState);
  } catch (error) {
    console.error("Error rendering board:", error.message);
    return <div className="error">Error rendering board: {error.message}</div>;
  }

  const rows = boardState["board"];
  return (
    <div className="board">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <span
              key={cellIndex}
              className="cell"
              onClick={() => handleCellClick(rowIndex, cellIndex, cell)}
            >
              {cell ? cell : "x"}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

const Board = ({ boardState }) => {
  // Check if the board state is valid
  if (!boardState) {
    return <div>Loading...</div>;
  }

  // Handle cell click
  const handleCellClick = (rowIndex, cellIndex, cell) => {
    console.log(`Clicked cell at row ${rowIndex}, column ${cellIndex}:`, cell);
    if (onCellClick) {
      onCellClick(rowIndex, cellIndex, cell);
    }
  };

  return <div className="board-container">{renderBoard(boardState, handleCellClick)}</div>;
};

export default Board;