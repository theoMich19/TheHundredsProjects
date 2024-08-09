document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart');
    const currentPlayerDisplay = document.getElementById('current-player');
    const playerXWinsDisplay = document.getElementById('player-x-wins');
    const playerOWinsDisplay = document.getElementById('player-o-wins');
    const drawsDisplay = document.getElementById('draws');
    let currentPlayer = 'x';
    let gameActive = true;
    let playerXWins = 0;
    let playerOWins = 0;
    let draws = 0;
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = cell.getAttribute('data-index');

        if (cell.classList.contains('player-x') || cell.classList.contains('player-o') || !gameActive) {
            return;
        }

        cell.classList.add(`player-${currentPlayer}`);

        if (checkWin()) {
            gameActive = false;
            setTimeout(() => {
                alert(`Player ${currentPlayer.toUpperCase()} wins!`);
                updateStats(currentPlayer);
                restartGame();
            }, 300);
        } else if (isDraw()) {
            gameActive = false;
            setTimeout(() => {
                alert('Draw!');
                updateStats('draw');
                restartGame();
            }, 300);
        } else {
            currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
            updateCurrentPlayerDisplay();
            if (currentPlayer === 'o' && gameActive) {
                setTimeout(() => {
                    computerPlay();
                }, 500);
            }
        }
    }

    function computerPlay() {
        const bestMove = minimax(cells, 'o').index;
        cells[bestMove].classList.add('player-o');

        if (checkWin()) {
            gameActive = false;
            setTimeout(() => {
                alert('Player O wins!');
                updateStats('o');
                restartGame();
            }, 300);
        } else if (isDraw()) {
            gameActive = false;
            setTimeout(() => {
                alert('Draw!');
                updateStats('draw');
                restartGame();
            }, 300);
        } else {
            currentPlayer = 'x';
            updateCurrentPlayerDisplay();
        }
    }

    function checkWin() {
        return winningConditions.some(condition => {
            return condition.every(index => {
                return cells[index].classList.contains(`player-${currentPlayer}`);
            });
        });
    }

    function isDraw() {
        return Array.from(cells).every(cell => {
            return cell.classList.contains('player-x') || cell.classList.contains('player-o');
        });
    }

    function restartGame() {
        currentPlayer = 'x';
        gameActive = true;
        cells.forEach(cell => {
            cell.classList.remove('player-x', 'player-o');
        });
        updateCurrentPlayerDisplay();
    }

    function minimax(newCells, player) {
        const availCells = Array.from(newCells).filter(cell => {
            return !cell.classList.contains('player-x') && !cell.classList.contains('player-o');
        });

        if (checkWinner(newCells, 'x')) {
            return { score: -10 };
        } else if (checkWinner(newCells, 'o')) {
            return { score: 10 };
        } else if (availCells.length === 0) {
            return { score: 0 };
        }

        const moves = [];

        for (let i = 0; i < availCells.length; i++) {
            const move = {};
            move.index = availCells[i].getAttribute('data-index');

            newCells[move.index].classList.add(`player-${player}`);

            if (player === 'o') {
                const result = minimax(newCells, 'x');
                move.score = result.score;
            } else {
                const result = minimax(newCells, 'o');
                move.score = result.score;
            }

            newCells[move.index].classList.remove(`player-${player}`);
            moves.push(move);
        }

        let bestMove;
        if (player === 'o') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function checkWinner(newCells, player) {
        return winningConditions.some(condition => {
            return condition.every(index => {
                return newCells[index].classList.contains(`player-${player}`);
            });
        });
    }

    function updateCurrentPlayerDisplay() {
        currentPlayerDisplay.textContent = currentPlayer.toUpperCase();
    }

    function updateStats(winner) {
        if (winner === 'x') {
            playerXWins++;
            playerXWinsDisplay.textContent = playerXWins;
        } else if (winner === 'o') {
            playerOWins++;
            playerOWinsDisplay.textContent = playerOWins;
        } else if (winner === 'draw') {
            draws++;
            drawsDisplay.textContent = draws;
        }
    }

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', () => {
        if (gameActive) {
            updateStats(currentPlayer === 'x' ? 'o' : 'x');
        }
        restartGame();
    });

    updateCurrentPlayerDisplay();
});
