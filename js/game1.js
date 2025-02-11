
let isPlayerTurn = true;
const currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
const computerPlayer = JSON.parse(localStorage.getItem("computerPlayer"));
const playerScoreElement = document.querySelector("#player_score");
const computerScoreElement = document.querySelector("#computer_score");
 const piecesPlayer = document.querySelector("#piecesPlayer");
 const piecesComputer = document.querySelector("#piecesComputer");
 let playerEat = 0;
 let computerPlayerEat = 0;
let computerPlayerScore = 0;
let board = document.querySelector("#id_board");
let matrix = [
    [-1, 1, -1, 1, -1, 1, -1, 1],
    [1, -1, 1, -1, 1, -1, 1, -1],
    [-1, 1, -1, 1, -1, 1, -1, 1],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [2, -1, 2, -1, 2, -1, 2, -1],
    [-1, 2, -1, 2, -1, 2, -1, 2],
    [2, -1, 2, -1, 2, -1, 2, -1],
];
const timer =()=>{
const display = document.getElementById("timer");
let seconds = 0;
const timer = setInterval(() => {
    let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    let secs = String(seconds % 60).padStart(2, '0');
    display.textContent = `${hrs}:${mins}:${secs}`;
    seconds++;
}, 1000);
}
const createBoard = () => {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {

            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add((i + j) % 2 === 0 ? "blackCell" : "whiteCell");
            board.append(cell);
            cell.dataset.row = i;
            cell.dataset.col = j;

            if (matrix[i][j] === 1 || matrix[i][j] === 2) {
                let circle = document.createElement("div");
                circle.dataset.row = i;
                circle.dataset.col = j;
                if (matrix[i][j] === 1) {
                    circle.classList.add("circle", "blackCircle");
                } else if (matrix[i][j] === 2) {
                    circle.classList.add("circle", "whiteCircle");
                }
                // מאזין לתא שלוחצים עליו כדי להראו לו את האפשרויות שלו
                circle.addEventListener("click", () => {
                    showPossibleMoves(circle);
                });

                cell.appendChild(circle);
                //נותן לי יכולת להזיז את העיגול
                circle.setAttribute("draggable", "true");
                // שומר על העיגול שזז
                circle.addEventListener("dragstart", dragStart);
            }

            // מאזין לתא שנגרר משהו מתוכו
            cell.addEventListener("dragover", dragOver);
            // מאזין לתא שנגרר משהו לתוכו
            cell.addEventListener("drop", drop);
        }
    }
};

let draggedCircle;
const dragStart = (e) => {
         if (!isPlayerTurn || e.target.classList.contains('blackCircle')) {
            e.preventDefault();
             return false;
         }
         draggedCircle = e.target;
    
     }


const dragOver = (e) => {
    e.preventDefault();

}
// עדכון פונקציית drop


const drop = (e) => {
    if (!isPlayerTurn) return;
    e.preventDefault();
    let target = e.target;

    if (isValidMove(target)) {
        target.appendChild(draggedCircle);

        //עדכון המיקום של העיגול שורה וטור
        draggedCircle.dataset.row = target.dataset.row;
        draggedCircle.dataset.col = target.dataset.col;
        isPlayerTurn = false;
     
          if (!checkWinner()) {  // בודק אם יש מנצח
        isPlayerTurn = false;
        setTimeout(makeComputerMove, 1000);
         }


    }
}

const updateCurrentPiecses = () => {
    const whitePieces = document.querySelectorAll('.whiteCircle').length;
    const blackPieces = document.querySelectorAll('.blackCircle').length;
    playerEat = 12 - blackPieces; 
    computerPlayerEat = 12 - whitePieces;
    const firstName = currentPlayer.name.split(" ")[0];
    piecesPlayer.textContent = `Eat ${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()}`;
    piecesComputer.textContent =`Eat Computer`;
    updateCircleUi();
}
const updateCircleUi = () => {
    const existingPlayerCircles = piecesPlayer.querySelectorAll(".blackCircle").length;
    const existingComputerCircles = piecesComputer.querySelectorAll(".whiteCircle").length;

    // הוספת עיגולים לשחקן רק אם חסרים
    for (let i = existingPlayerCircles; i < playerEat; i++) {
        let circle = document.createElement("div");
        circle.classList.add("circles", "blackCircles");
        circle.style.width = "35px";
        circle.style.height = "35px";
        circle.style.margin = "5px";
        piecesPlayer.appendChild(circle);
    }

    // הוספת עיגולים למחשב רק אם חסרים
    for (let i = existingComputerCircles; i < computerPlayerEat; i++) {
        let circle = document.createElement("div");
        circle.classList.add("circles", "whiteCircles");
        circle.style.width = "35px";
        circle.style.height = "35px";
        circle.style.margin = "5px";
        piecesComputer.appendChild(circle);
    }
};



const canEat = (target) => {
    let cellRow = parseInt(target.dataset.row);
    let cellCol = parseInt(target.dataset.col);
    let circleRow = parseInt(draggedCircle.dataset.row);
    let circleCol = parseInt(draggedCircle.dataset.col);



    if (!draggedCircle.classList.contains('king')) {


        if (draggedCircle.classList.contains('blackCircle')) {
            if (cellRow <= circleRow) return false; // שחור לא יכול לאכול אחורה
        } else {
            if (cellRow >= circleRow) return false; // לבן לא יכול לאכול אחורה
        }
    }
    // בדיקה האם המהלך הוא קפיצה של 2
    if (Math.abs(circleRow - cellRow) !== 2) return false;
    if (Math.abs(circleCol - cellCol) !== 2) return false;

    // מציאת הכלי שנמצא באמצע (שאמור להיאכל)
    let middleRow = (circleRow + cellRow) / 2;
    let middleCol = (circleCol + cellCol) / 2;


    // במקום לחפש בכל התאים, אפשר ישירות לפנות לתא הספציפי
    let middleCell = document.querySelector(
        `.cell[data-row="${middleRow}"][data-col="${middleCol}"]`
    );

    if (!middleCell || !middleCell.firstChild) return false;

    let middlePiece = middleCell.firstChild;

    // בדיקה האם הכלי באמצע הוא של היריב
    return (draggedCircle.classList.contains('blackCircle') &&
        middlePiece.classList.contains('whiteCircle')) ||
        (draggedCircle.classList.contains('whiteCircle') &&
            middlePiece.classList.contains('blackCircle'));
}





 const isValidMove = (target) => {
        clearHighlights();
        if (!target.classList.contains("cell")) return false;
    
        let cellRow = parseInt(target.dataset.row);
        let cellCol = parseInt(target.dataset.col);
        let circleRow = parseInt(draggedCircle.dataset.row);
        let circleCol = parseInt(draggedCircle.dataset.col);
    
        if (canEat(target)) {
            removePiece(target)
            checkForKing(draggedCircle, cellRow);
            return true;
        }
    
        if (draggedCircle.classList.contains('king')) {
            if (Math.abs(circleRow - cellRow) !== 1) return false;
            if (Math.abs(circleCol - cellCol) !== 1) return false;
            return true;
        }
    
        if (circleRow - cellRow !== 1 && draggedCircle.classList.contains("whiteCircle")) return false;
    
        if (circleRow - cellRow !== -1 && draggedCircle.classList.contains("blackCircle")) return false;
    
        if (Math.abs(circleCol - cellCol) !== 1) return false;
    
        checkForKing(draggedCircle, cellRow);
    
    
    
    
        return true;
    }

// פונקציה להסרת הכלי שנאכל
const removePiece = (target) => {
    let cellRow = parseInt(target.dataset.row);
    let cellCol = parseInt(target.dataset.col);
    let circleRow = parseInt(draggedCircle.dataset.row);
    let circleCol = parseInt(draggedCircle.dataset.col);

    let middleRow = (circleRow + cellRow) / 2;
    let middleCol = (circleCol + cellCol) / 2;

    let middleCell = document.querySelector(
        `.cell[data-row="${middleRow}"][data-col="${middleCol}"]`
    );

    if (middleCell && middleCell.firstChild) {
        middleCell.removeChild(middleCell.firstChild);
        matrix[middleRow][middleCol] = 0;
        updateCurrentPiecses ();
        isPlayerTurn = true;
        

    }
}


const checkForKing = (circle, row) => {
    // בדיקה האם החייל הגיע לשורה האחרונה
    if (circle.classList.contains('blackCircle') && row === 7) {
        circle.classList.add('king');
        circle.style.backgroundImage = 'url("../images/dark_king.png")';
    }
    if (circle.classList.contains('whiteCircle') && row === 0) {
        circle.classList.add('king');
        circle.style.backgroundImage = 'url("../images/white_king.png")';
    }
}

const showPossibleMoves = (circle) => {
    if (!isPlayerTurn || circle.classList.contains('blackCircle')) {
        return;
    }

    clearHighlights();
    draggedCircle = circle

    let row = parseInt(circle.dataset.row);
    let col = parseInt(circle.dataset.col);

    if (isNaN(row) || isNaN(col)) return;

    let validMoves = getValidMoves(circle, row, col);
    let eatingMoves = getEatingMoves(circle, row, col);

    validMoves.forEach(move => {
        highlightCell(move, "../images/dark_selected_wood.png");
    });

    eatingMoves.forEach(move => {
        highlightCell(move, "../images/dark_selected_wood.png");
    });
}

const getValidMoves = (circle, row, col) => {
    let moves = [];

    if (circle.classList.contains('king')) {
        moves = [
            { row: row + 1, col: col + 1 },
            { row: row + 1, col: col - 1 },
            { row: row - 1, col: col + 1 },
            { row: row - 1, col: col - 1 }
        ];
    } else if (circle.classList.contains('blackCircle')) {
        moves = [
            { row: row + 1, col: col + 1 },
            { row: row + 1, col: col - 1 }
        ];
    } else {
        moves = [
            { row: row - 1, col: col + 1 },
            { row: row - 1, col: col - 1 }
        ];
    }
    return moves.filter(move => isValidPosition(move.row, move.col));
}
const getEatingMoves = (circle, row, col) => {
    let possibleMoves = [];

    // מלך יכול לנוע לכל הכיוונים
    if (circle.classList.contains('king')) {
        possibleMoves = [
            { row: row + 2, col: col + 2 },
            { row: row + 2, col: col - 2 },
            { row: row - 2, col: col + 2 },
            { row: row - 2, col: col - 2 }
        ];
    }
    // כלי שחור נע רק למטה
    else if (circle.classList.contains('blackCircle')) {
        possibleMoves = [
            { row: row + 2, col: col + 2 },
            { row: row + 2, col: col - 2 }
        ];
    }
    // כלי לבן נע רק למעלה 
    else if (circle.classList.contains('whiteCircle')) {
        possibleMoves = [
            { row: row - 2, col: col + 2 },
            { row: row - 2, col: col - 2 }
        ];
    }

    // סינון מהלכים חוקיים ואפשריים לאכילה
    return possibleMoves.filter(move => {
        if (!isValidPosition(move.row, move.col)) return false;
        let targetCell = document.querySelector(
            `.cell[data-row="${move.row}"][data-col="${move.col}"]`
        );
        return targetCell && canEat(targetCell);
    });
}
const highlightCell = (move, color) => {
    let cell = document.querySelector(
        `.cell[data-row="${move.row}"][data-col="${move.col}"]`
    );
    if (cell && !cell.firstChild && cell.classList.contains('whiteCell')) {
        cell.style.backgroundImage = `url(${color})`;
    }
}

const clearHighlights = () => {
    document.querySelectorAll('.whiteCell').forEach(cell => {
        cell.style.backgroundImage = "";
    });
}

const isValidPosition = (row, col) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
const makeComputerMove = () => {
    const computerPieces = Array.from(document.querySelectorAll('.blackCircle'));
    let validMove = false;


    // קודם בודק אם יש אפשרות לאכול
    for (let piece of computerPieces) {
        draggedCircle = piece;
        const row = parseInt(piece.dataset.row);
        const col = parseInt(piece.dataset.col);
        const eatingMoves = getEatingMoves(piece, row, col);

        const validEatingMoves = eatingMoves.filter(move => {
            const targetCell = document.querySelector(
                `.cell[data-row="${move.row}"][data-col="${move.col}"]`
            );
            return targetCell && !targetCell.firstChild;
        });

        if (validEatingMoves.length > 0) {
            const move = validEatingMoves[Math.floor(Math.random() * validEatingMoves.length)];
            const targetCell = document.querySelector(
                `.cell[data-row="${move.row}"][data-col="${move.col}"]`
            );

            // מוצא את החייל שצריך להיאכל
            const middleRow = (parseInt(piece.dataset.row) + move.row) / 2;
            const middleCol = (parseInt(piece.dataset.col) + move.col) / 2;
            const middleCell = document.querySelector(
                `.cell[data-row="${middleRow}"][data-col="${middleCol}"]`
            );

            // קודם מזיז את החייל
            targetCell.appendChild(piece);
            piece.dataset.row = move.row.toString();
            piece.dataset.col = move.col.toString();

            // אחר כך מסיר את החייל שנאכל
            if (middleCell && middleCell.firstChild) {
                middleCell.removeChild(middleCell.firstChild);
                matrix[middleRow][middleCol] = 0;
                updateCurrentPiecses(); // מוסיפים קריאה כאן
                isPlayerTurn = true;
            }


            checkForKing(piece, move.row);
            validMove = true;
            break;
        }
    }



    if (!validMove) {
        // מערבב את החיילים בצורה רנדומלית
        computerPieces.sort(() => Math.random() - 0.5);

        for (let piece of computerPieces) {
            draggedCircle = piece;
            const row = parseInt(piece.dataset.row);
            const col = parseInt(piece.dataset.col);
            const validMoves = getValidMoves(piece, row, col);

            // מסנן רק מהלכים לתאים ריקים
            const possibleMoves = validMoves.filter(move => {
                const targetCell = document.querySelector(
                    `.cell[data-row="${move.row}"][data-col="${move.col}"]`
                );
                return targetCell && !targetCell.firstChild;
            });

            if (possibleMoves.length > 0) {
                // בוחר מהלך רנדומלי
                const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                const targetCell = document.querySelector(
                    `.cell[data-row="${move.row}"][data-col="${move.col}"]`
                );

                targetCell.appendChild(piece);
                piece.dataset.row = move.row.toString();
                piece.dataset.col = move.col.toString();
                checkForKing(piece, move.row);

                validMove = true;
                break;
            }
        }
    }

    if (validMove) {

        setTimeout(() => {
            if (!checkWinner()) {
                isPlayerTurn = true;
            }
        }, 1000);  // השהייה של חצי שנייה
    }
}
const checkWinner = () => {
    const blackPieces = document.querySelectorAll('.blackCircle');
    const whitePieces = document.querySelectorAll('.whiteCircle');
    let currentPlayerData = JSON.parse(localStorage.getItem("currentPlayer"));


    

    if (blackPieces.length === 0) {
        currentPlayerData.wins = (currentPlayerData.wins || 0) + 1;
        currentPlayerData.playTime = (currentPlayerData.playTime || 0) + gameTime;
        localStorage.setItem("currentPlayer", JSON.stringify(currentPlayerData));
        
        alert(`${currentPlayerData.name} Won!`);
        setTimeout(() => {
            window.location.href = "../project-folder/start.html";
        }, 2000);
        return true;
    }

    if (whitePieces.length === 0) {
        currentPlayerData.losses = (currentPlayerData.losses || 0) + 1;
        currentPlayerData.playTime = (currentPlayerData.playTime || 0) + gameTime;
        localStorage.setItem("currentPlayer", JSON.stringify(currentPlayerData));
        
        alert("Computer Won!");
        setTimeout(() => {
            window.location.href = "../project-folder/start.html";
        }, 2000);
        return true;
    }

    return false;
}

createBoard();
updateCurrentPiecses();
timer();
