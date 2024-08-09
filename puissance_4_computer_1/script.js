document.addEventListener('DOMContentLoaded', () => {
    const columns = 7;
    const rows = 6;
    const board = document.getElementById('board');
    const currentPlayerDisplay = document.getElementById('current-player');
    const player1WinsDisplay = document.getElementById('player1-wins');
    const player2WinsDisplay = document.getElementById('player2-wins');
    const drawsDisplay = document.getElementById('draws');
    const restartButton = document.getElementById('restart');
    
    let currentPlayer = 'player1';
    let gameActive = true;
    let player1Wins = 0;
    let player2Wins = 0;
    let draws = 0;
    let boardState = Array(rows).fill(null).map(() => Array(columns).fill(null));
    
    function createBoard() {
        board.innerHTML = '';
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.column = c;
                cell.dataset.row = r;
                board.appendChild(cell);
            }
        }
    }
    
    function handleCellClick(event) {
        if (!gameActive || currentPlayer === 'player2') return;

        const column = event.target.dataset.column;
        if (column === undefined) return;

        for (let r = rows - 1; r >= 0; r--) {
            if (!boardState[r][column]) {
                boardState[r][column] = currentPlayer;
                updateBoard();
                if (checkResult()) return;
                switchPlayer();
                setTimeout(computerMove, 500); // Computer moves after 500ms
                break;
            }
        }
    }
    
    function computerMove() {
        if (!gameActive) return;

        let column;
        // Simple AI: pick a random column
        do {
            column = Math.floor(Math.random() * columns);
        } while (boardState[0][column]);

        for (let r = rows - 1; r >= 0; r--) {
            if (!boardState[r][column]) {
                boardState[r][column] = 'player2';
                updateBoard();
                if (checkResult()) return;
                switchPlayer();
                break;
            }
        }
    }
    
    function updateBoard() {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                const cell = document.querySelector(`.cell[data-column='${c}'][data-row='${r}']`);
                if (boardState[r][c]) {
                    cell.classList.add(boardState[r][c]);
                } else {
                    cell.classList.remove('player1', 'player2');
                }
            }
        }
    }
    
    function switchPlayer() {
        currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
        currentPlayerDisplay.textContent = currentPlayer === 'player1' ? 'Player 1' : 'Player 2';
    }
    
    function checkResult() {
        if (checkWin()) {
            gameActive = false;
            setTimeout(() => {
                alert(`${currentPlayer === 'player1' ? 'Player 1' : 'Player 2'} wins!`);
                updateStats(currentPlayer);
                resetBoard();
            }, 300);
            return true;
        } else if (checkDraw()) {
            gameActive = false;
            setTimeout(() => {
                alert('Draw!');
                updateStats('draw');
                resetBoard();
            }, 300);
            return true;
        }
        return false;
    }
    
    function checkWin() {
        // Check horizontal, vertical, and diagonal win conditions
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (boardState[r][c] && (checkDirection(r, c, 1, 0) || checkDirection(r, c, 0, 1) || checkDirection(r, c, 1, 1) || checkDirection(r, c, 1, -1))) {
                    return true;
                }
            }
        }
        return false;
    }
    
    function checkDirection(r, c, dr, dc) {
        const player = boardState[r][c];
        let count = 0;
        
        for (let i = 0; i < 4; i++) {
            const row = r + dr * i;
            const col = c + dc * i;
            if (row >= 0 && row < rows && col >= 0 && col < columns && boardState[row][col] === player) {
                count++;
            } else {
                break;
            }
        }
        
        return count === 4;
    }
    
    function checkDraw() {
        return boardState.every(row => row.every(cell => cell));
    }
    
    function updateStats(winner) {
        if (winner === 'player1') {
            player1Wins++;
            player1WinsDisplay.textContent = player1Wins;
        } else if (winner === 'player2') {
            player2Wins++;
            player2WinsDisplay.textContent = player2Wins;
        } else if (winner === 'draw') {
            draws++;
            drawsDisplay.textContent = draws;
        }
    }
    
    function resetBoard() {
        boardState = Array(rows).fill(null).map(() => Array(columns).fill(null));
        gameActive = true;
        updateBoard();
    }
    
    createBoard();
    board.addEventListener('click', handleCellClick);
    restartButton.addEventListener('click', resetBoard);
});
