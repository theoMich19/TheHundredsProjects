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
