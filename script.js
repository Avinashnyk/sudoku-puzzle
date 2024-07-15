const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

let currentBoard = JSON.parse(JSON.stringify(initialBoard));

function renderBoard(board) {
    const boardElement = document.getElementById('sudoku-board');
    boardElement.innerHTML = '';
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.contentEditable = board[row][col] === 0 ? 'true' : 'false';
            cell.innerText = board[row][col] !== 0 ? board[row][col] : '';
            cell.oninput = handleInput;
            cell.onclick = () => highlightRowCol(row, col);
            boardElement.appendChild(cell);
        }
    }
}

function handleInput(e) {
    const value = e.target.innerText;
    if (!/^[1-9]$/.test(value)) {
        e.target.innerText = '';
    }
}

function highlightRowCol(row, col) {
    clearHighlight();
    const boardElement = document.getElementById('sudoku-board');
    const cells = boardElement.getElementsByClassName('cell');
    for (let i = 0; i < 9; i++) {
        cells[row * 9 + i].classList.add('highlight');  // Highlight the row
        cells[i * 9 + col].classList.add('highlight');  // Highlight the column
    }
}

function clearHighlight() {
    const boardElement = document.getElementById('sudoku-board');
    const cells = boardElement.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove('highlight');
    }
}

function getBoardState() {
    const boardElement = document.getElementById('sudoku-board');
    const cells = boardElement.getElementsByClassName('cell');
    const board = [];
    let row = [];
    for (let i = 0; i < cells.length; i++) {
        const value = cells[i].innerText;
        row.push(value ? parseInt(value) : 0);
        if ((i + 1) % 9 === 0) {
            board.push(row);
            row = [];
        }
    }
    return board;
}

function checkSolution() {
    const board = getBoardState();
    if (solveSudoku(board)) {
        document.getElementById('message').innerText = 'Congratulations! You solved it!';
        renderBoard(board);
    } else {
        document.getElementById('message').innerText = 'There are errors in your solution.';
    }
}

function solveSudoku(board) {
    const emptyPos = findEmpty(board);
    if (!emptyPos) {
        return true;
    }

    const [row, col] = emptyPos;
    for (let num = 1; num <= 9; num++) {
        if (isValid(board, num, row, col)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
                return true;
            }
            board[row][col] = 0;
        }
    }
    return false;
}

function findEmpty(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return null;
}

function isValid(board, num, row, col) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) {
            return false;
        }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === num) {
                return false;
            }
        }
    }

    return true;
}

function generateNewPuzzle(difficulty) {
    const newBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveSudoku(newBoard);
    let cellsToRemove;
    switch (difficulty) {
        case 'easy':
            cellsToRemove = 30;
            break;
        case 'medium':
            cellsToRemove = 40;
            break;
        case 'hard':
            cellsToRemove = 50;
            break;
        default:
            cellsToRemove = 40;
    }
    removeNumbers(newBoard, cellsToRemove);
    return newBoard;
}

function removeNumbers(board, count) {
    while (count > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            count--;
        }
    }
}

function newGame(difficulty = 'medium') {
    currentBoard = generateNewPuzzle(difficulty);
    renderBoard(currentBoard);
}

// Initialize the board on page load
window.onload = () => newGame();
