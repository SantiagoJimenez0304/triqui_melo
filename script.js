// Variables globales
const cells = document.querySelectorAll(".cell");
const message = document.getElementById("message");
let board = ["", "", "", "", "", "", "", "", ""];
const human = "X";
const ai = "O";
let currentPlayer = human; // Empieza el humano


// Agregar eventos a las celdas
cells.forEach(cell => {
    cell.addEventListener("click", handleClick);
});

function handleClick(event) {
    const index = event.target.dataset.index;

    // Verifica que la celda esté vacía y sea turno del humano
    if (board[index] === "" && currentPlayer === human) {
        board[index] = human;
        event.target.textContent = human;

        if (checkWinner()) return; // Detiene el juego si hay ganador o empate

        // Turno de la IA después de un pequeño retraso
        currentPlayer = ai;
        setTimeout(aiMove, 500);
    }
}

// Movimiento de la IA
function aiMove() {
    let bestMove;
    
    // 30% de probabilidad de hacer una jugada aleatoria
    if (Math.random() < 0.3) {
        let emptySpots = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        bestMove = emptySpots[Math.floor(Math.random() * emptySpots.length)];
    } else {
        bestMove = minimax(board, ai).index;
    }

    board[bestMove] = ai;
    cells[bestMove].textContent = ai;

    if (checkWinner()) return; // Detiene el juego si hay ganador o empate

    currentPlayer = human;
}

// Algoritmo Minimax
function minimax(newBoard, player) {
    let emptySpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    if (checkWin(newBoard, human)) return { score: -10 };
    if (checkWin(newBoard, ai)) return { score: 10 };
    if (emptySpots.length === 0) return { score: 0 };

    let moves = [];

    emptySpots.forEach(index => {
        let move = { index };
        newBoard[index] = player;
        move.score = minimax(newBoard, player === ai ? human : ai).score;
        newBoard[index] = "";
        moves.push(move);
    });

    return moves.reduce((best, move) => 
        (player === ai ? move.score > best.score : move.score < best.score) ? move : best
    );
}

// Comprobación de ganador
function checkWinner() {
    if (checkWin(board, human)) {
        message.innerText = '¡Felicidades! Ganaste contra la IA.\nLa respuesta a la pista es: "Componente o proceso cumple con los requisitos especificados y las expectativas del cliente"';
        return true;
    } else if (checkWin(board, ai)) {
        message.innerText = "Perdiste. La IA ganó.";
        return true;
    } else if (!board.includes("")) {
        message.innerText = "¡Empate!";
        return true;
    }
    return false;
}

// Patrones de victoria
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

// Verifica si hay un ganador en el tablero
function checkWin(board, player) {
    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}
