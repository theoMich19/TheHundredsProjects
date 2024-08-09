document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart');
    let currentPlayer = 'x';
    let gameActive = true;
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
            }, 300); // Wait for animation to complete before showing alert
        } else if (isDraw()) {
            gameActive = false;
            setTimeout(() => {
                alert('Draw!');
            }, 300); // Wait for animation to complete before showing alert
        } else {
            currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
            if (currentPlayer === 'o' && gameActive) {
                computerPlay();
            }
        }
    }

    function computerPlay() {
        const availableCells = Array.from(cells).filter(cell => {
            return !cell.classList.contains('player-x') && !cell.classList.contains('player-o');
        });

        if (availableCells.length === 0) return;

        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        randomCell.classList.add('player-o');

        if (checkWin()) {
            gameActive = false;
            setTimeout(() => {
                alert('Player O wins!');
            }, 300); // Wait for animation to complete before showing alert
        } else if (isDraw()) {
            gameActive = false;
            setTimeout(() => {
                alert('Draw!');
            }, 300); // Wait for animation to complete before showing alert
        } else {
            currentPlayer = 'x';
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
    }

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', restartGame);
});
