const canvas = document.getElementById('chess-board');
const ctx = canvas.getContext('2d');
const cellSize = 58;
const boardOffsetX = 29;
const boardOffsetY = 29;

const pieceNames = {
    'R': { red: '車', black: '車' },
    'N': { red: '馬', black: '馬' },
    'B': { red: '相', black: '象' },
    'A': { red: '仕', black: '士' },
    'K': { red: '帥', black: '將' },
    'C': { red: '炮', black: '砲' },
    'P': { red: '兵', black: '卒' }
};

let board = [];
let selectedPiece = null;
let currentPlayer = 'red';
let validMoves = [];
let moveHistory = [];

function initializeBoard() {
    board = [
        ['bR', 'bN', 'bB', 'bA', 'bK', 'bA', 'bB', 'bN', 'bR'],
        [null, null, null, null, null, null, null, null, null],
        [null, 'bC', null, null, null, null, null, 'bC', null],
        ['bP', null, 'bP', null, 'bP', null, 'bP', null, 'bP'],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        ['rP', null, 'rP', null, 'rP', null, 'rP', null, 'rP'],
        [null, 'rC', null, null, null, null, null, 'rC', null],
        [null, null, null, null, null, null, null, null, null],
        ['rR', 'rN', 'rB', 'rA', 'rK', 'rA', 'rB', 'rN', 'rR']
    ];
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 9; i++) {
        ctx.beginPath();
        ctx.moveTo(boardOffsetX, boardOffsetY + i * cellSize);
        ctx.lineTo(boardOffsetX + 8 * cellSize, boardOffsetY + i * cellSize);
        ctx.stroke();
    }
    
    for (let i = 0; i <= 8; i++) {
        if (i === 0 || i === 8) {
            ctx.beginPath();
            ctx.moveTo(boardOffsetX + i * cellSize, boardOffsetY);
            ctx.lineTo(boardOffsetX + i * cellSize, boardOffsetY + 9 * cellSize);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(boardOffsetX + i * cellSize, boardOffsetY);
            ctx.lineTo(boardOffsetX + i * cellSize, boardOffsetY + 4 * cellSize);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(boardOffsetX + i * cellSize, boardOffsetY + 5 * cellSize);
            ctx.lineTo(boardOffsetX + i * cellSize, boardOffsetY + 9 * cellSize);
            ctx.stroke();
        }
    }
    
    ctx.beginPath();
    ctx.moveTo(boardOffsetX + 3 * cellSize, boardOffsetY);
    ctx.lineTo(boardOffsetX + 5 * cellSize, boardOffsetY + 2 * cellSize);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(boardOffsetX + 5 * cellSize, boardOffsetY);
    ctx.lineTo(boardOffsetX + 3 * cellSize, boardOffsetY + 2 * cellSize);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(boardOffsetX + 3 * cellSize, boardOffsetY + 7 * cellSize);
    ctx.lineTo(boardOffsetX + 5 * cellSize, boardOffsetY + 9 * cellSize);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(boardOffsetX + 5 * cellSize, boardOffsetY + 7 * cellSize);
    ctx.lineTo(boardOffsetX + 3 * cellSize, boardOffsetY + 9 * cellSize);
    ctx.stroke();
    
    ctx.fillStyle = '#8b4513';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('楚河', boardOffsetX + 2 * cellSize, boardOffsetY + 4.5 * cellSize);
    ctx.fillText('漢界', boardOffsetX + 6 * cellSize, boardOffsetY + 4.5 * cellSize);
}

function drawPieces() {
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = board[row][col];
            if (piece) {
                const x = boardOffsetX + col * cellSize;
                const y = boardOffsetY + row * cellSize;
                
                ctx.fillStyle = '#f5deb3';
                ctx.beginPath();
                ctx.arc(x, y, 25, 0, 2 * Math.PI);
                ctx.fill();
                
                ctx.strokeStyle = piece[0] === 'r' ? '#d32f2f' : '#333';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                ctx.fillStyle = piece[0] === 'r' ? '#d32f2f' : '#333';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const pieceType = piece[1];
                const color = piece[0] === 'r' ? 'red' : 'black';
                ctx.fillText(pieceNames[pieceType][color], x, y);
            }
        }
    }
}

function drawValidMoves() {
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    for (const move of validMoves) {
        const x = boardOffsetX + move.col * cellSize;
        const y = boardOffsetY + move.row * cellSize;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawSelectedPiece() {
    if (selectedPiece) {
        const x = boardOffsetX + selectedPiece.col * cellSize;
        const y = boardOffsetY + selectedPiece.row * cellSize;
        ctx.strokeStyle = '#ffeb3b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

function getValidMoves(row, col) {
    const piece = board[row][col];
    if (!piece) return [];
    
    const moves = [];
    const color = piece[0];
    const type = piece[1];
    
    switch (type) {
        case 'R':
            for (let i = row + 1; i < 10; i++) {
                if (!board[i][col]) {
                    moves.push({ row: i, col });
                } else {
                    if (board[i][col][0] !== color) moves.push({ row: i, col });
                    break;
                }
            }
            for (let i = row - 1; i >= 0; i--) {
                if (!board[i][col]) {
                    moves.push({ row: i, col });
                } else {
                    if (board[i][col][0] !== color) moves.push({ row: i, col });
                    break;
                }
            }
            for (let j = col + 1; j < 9; j++) {
                if (!board[row][j]) {
                    moves.push({ row, col: j });
                } else {
                    if (board[row][j][0] !== color) moves.push({ row, col: j });
                    break;
                }
            }
            for (let j = col - 1; j >= 0; j--) {
                if (!board[row][j]) {
                    moves.push({ row, col: j });
                } else {
                    if (board[row][j][0] !== color) moves.push({ row, col: j });
                    break;
                }
            }
            break;
            
        case 'N':
            const knightMoves = [
                { dr: -2, dc: -1 }, { dr: -2, dc: 1 },
                { dr: -1, dc: -2 }, { dr: -1, dc: 2 },
                { dr: 1, dc: -2 }, { dr: 1, dc: 2 },
                { dr: 2, dc: -1 }, { dr: 2, dc: 1 }
            ];
            for (const move of knightMoves) {
                const newRow = row + move.dr;
                const newCol = col + move.dc;
                if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
                    const blockRow = row + (move.dr > 0 ? 1 : -1) * (Math.abs(move.dr) === 2 ? 1 : 0);
                    const blockCol = col + (move.dc > 0 ? 1 : -1) * (Math.abs(move.dc) === 2 ? 1 : 0);
                    if (!board[blockRow][blockCol]) {
                        if (!board[newRow][newCol] || board[newRow][newCol][0] !== color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                    }
                }
            }
            break;
            
        case 'B':
            const elephantMoves = [
                { dr: -2, dc: -2 }, { dr: -2, dc: 2 },
                { dr: 2, dc: -2 }, { dr: 2, dc: 2 }
            ];
            for (const move of elephantMoves) {
                const newRow = row + move.dr;
                const newCol = col + move.dc;
                const blockRow = row + move.dr / 2;
                const blockCol = col + move.dc / 2;
                
                if (color === 'r' && newRow < 5) continue;
                if (color === 'b' && newRow > 4) continue;
                
                if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
                    if (!board[blockRow][blockCol]) {
                        if (!board[newRow][newCol] || board[newRow][newCol][0] !== color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                    }
                }
            }
            break;
            
        case 'A':
            const advisorMoves = [
                { dr: -1, dc: -1 }, { dr: -1, dc: 1 },
                { dr: 1, dc: -1 }, { dr: 1, dc: 1 }
            ];
            for (const move of advisorMoves) {
                const newRow = row + move.dr;
                const newCol = col + move.dc;
                
                if (newCol < 3 || newCol > 5) continue;
                if (color === 'r' && (newRow < 7 || newRow > 9)) continue;
                if (color === 'b' && (newRow < 0 || newRow > 2)) continue;
                
                if (!board[newRow][newCol] || board[newRow][newCol][0] !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
            break;
            
        case 'K':
            const kingMoves = [
                { dr: -1, dc: 0 }, { dr: 1, dc: 0 },
                { dr: 0, dc: -1 }, { dr: 0, dc: 1 }
            ];
            for (const move of kingMoves) {
                const newRow = row + move.dr;
                const newCol = col + move.dc;
                
                if (newCol < 3 || newCol > 5) continue;
                if (color === 'r' && (newRow < 7 || newRow > 9)) continue;
                if (color === 'b' && (newRow < 0 || newRow > 2)) continue;
                
                if (!board[newRow][newCol] || board[newRow][newCol][0] !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
            break;
            
        case 'C':
            for (let i = row + 1; i < 10; i++) {
                if (!board[i][col]) {
                    moves.push({ row: i, col });
                } else {
                    for (let j = i + 1; j < 10; j++) {
                        if (board[j][col]) {
                            if (board[j][col][0] !== color) {
                                moves.push({ row: j, col });
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            for (let i = row - 1; i >= 0; i--) {
                if (!board[i][col]) {
                    moves.push({ row: i, col });
                } else {
                    for (let j = i - 1; j >= 0; j--) {
                        if (board[j][col]) {
                            if (board[j][col][0] !== color) {
                                moves.push({ row: j, col });
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            for (let j = col + 1; j < 9; j++) {
                if (!board[row][j]) {
                    moves.push({ row, col: j });
                } else {
                    for (let k = j + 1; k < 9; k++) {
                        if (board[row][k]) {
                            if (board[row][k][0] !== color) {
                                moves.push({ row, col: k });
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            for (let j = col - 1; j >= 0; j--) {
                if (!board[row][j]) {
                    moves.push({ row, col: j });
                } else {
                    for (let k = j - 1; k >= 0; k--) {
                        if (board[row][k]) {
                            if (board[row][k][0] !== color) {
                                moves.push({ row, col: k });
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            break;
            
        case 'P':
            if (color === 'r') {
                if (row > 0 && (!board[row - 1][col] || board[row - 1][col][0] !== color)) {
                    moves.push({ row: row - 1, col });
                }
                if (row <= 4) {
                    if (col > 0 && (!board[row][col - 1] || board[row][col - 1][0] !== color)) {
                        moves.push({ row, col: col - 1 });
                    }
                    if (col < 8 && (!board[row][col + 1] || board[row][col + 1][0] !== color)) {
                        moves.push({ row, col: col + 1 });
                    }
                }
            } else {
                if (row < 9 && (!board[row + 1][col] || board[row + 1][col][0] !== color)) {
                    moves.push({ row: row + 1, col });
                }
                if (row >= 5) {
                    if (col > 0 && (!board[row][col - 1] || board[row][col - 1][0] !== color)) {
                        moves.push({ row, col: col - 1 });
                    }
                    if (col < 8 && (!board[row][col + 1] || board[row][col + 1][0] !== color)) {
                        moves.push({ row, col: col + 1 });
                    }
                }
            }
            break;
    }
    
    return moves;
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const capturedPiece = board[toRow][toCol];
    const movingPiece = board[fromRow][fromCol];
    
    moveHistory.push({
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol },
        piece: movingPiece,
        capturedPiece: capturedPiece,
        previousPlayer: currentPlayer
    });
    
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = null;
    
    if (capturedPiece) {
        const capturedColor = capturedPiece[0];
        const containerId = capturedColor === 'r' ? 'black-captured-pieces' : 'red-captured-pieces';
        const container = document.getElementById(containerId);
        const pieceDiv = document.createElement('div');
        pieceDiv.className = 'captured-piece';
        pieceDiv.style.color = capturedColor === 'r' ? '#d32f2f' : '#333';
        const pieceType = capturedPiece[1];
        const color = capturedColor === 'r' ? 'red' : 'black';
        pieceDiv.textContent = pieceNames[pieceType][color];
        container.appendChild(pieceDiv);
    }
    
    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    document.getElementById('current-player').textContent = currentPlayer === 'red' ? "Red's Turn" : "Black's Turn";
    document.getElementById('current-player').style.color = currentPlayer === 'red' ? '#d32f2f' : '#333';
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const col = Math.round((x - boardOffsetX) / cellSize);
    const row = Math.round((y - boardOffsetY) / cellSize);
    
    if (row < 0 || row > 9 || col < 0 || col > 8) return;
    
    if (selectedPiece) {
        const isValidMove = validMoves.some(move => move.row === row && move.col === col);
        
        if (isValidMove) {
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
            selectedPiece = null;
            validMoves = [];
        } else if (board[row][col] && board[row][col][0] === currentPlayer[0]) {
            selectedPiece = { row, col };
            validMoves = getValidMoves(row, col);
        } else {
            selectedPiece = null;
            validMoves = [];
        }
    } else {
        if (board[row][col] && board[row][col][0] === currentPlayer[0]) {
            selectedPiece = { row, col };
            validMoves = getValidMoves(row, col);
        }
    }
    
    render();
}

function render() {
    drawBoard();
    drawPieces();
    drawValidMoves();
    drawSelectedPiece();
}

function undoMove() {
    if (moveHistory.length === 0) return;
    
    const lastMove = moveHistory.pop();
    
    board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
    board[lastMove.to.row][lastMove.to.col] = lastMove.capturedPiece || null;
    
    currentPlayer = lastMove.previousPlayer;
    document.getElementById('current-player').textContent = currentPlayer === 'red' ? "Red's Turn" : "Black's Turn";
    document.getElementById('current-player').style.color = currentPlayer === 'red' ? '#d32f2f' : '#333';
    
    if (lastMove.capturedPiece) {
        const capturedColor = lastMove.capturedPiece[0];
        const containerId = capturedColor === 'r' ? 'black-captured-pieces' : 'red-captured-pieces';
        const container = document.getElementById(containerId);
        if (container.lastChild) {
            container.removeChild(container.lastChild);
        }
    }
    
    selectedPiece = null;
    validMoves = [];
    render();
}

function newGame() {
    initializeBoard();
    selectedPiece = null;
    currentPlayer = 'red';
    validMoves = [];
    moveHistory = [];
    document.getElementById('current-player').textContent = "Red's Turn";
    document.getElementById('current-player').style.color = '#d32f2f';
    document.getElementById('red-captured-pieces').innerHTML = '';
    document.getElementById('black-captured-pieces').innerHTML = '';
    render();
}

canvas.addEventListener('click', handleClick);
document.getElementById('new-game').addEventListener('click', newGame);
document.getElementById('undo').addEventListener('click', undoMove);

newGame();