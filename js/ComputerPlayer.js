class ComputerPlayer {
    constructor() {
        this.draggedCircle = null;
    }

    makeMove() {
        const computerPieces = Array.from(document.querySelectorAll('.blackCircle'));
        let validMove = false;

        // קודם בודק אם יש אפשרות לאכול
        validMove = this.tryEatingMove(computerPieces);

        // אם אין אכילות, מנסה מהלך רגיל
        if (!validMove) {
            validMove = this.tryRegularMove(computerPieces);
        }

        // מחזיר את התור לשחקן
        if (validMove) {
            return true;
        }
        return false;
    }

    tryEatingMove(computerPieces) {
        for (let piece of computerPieces) {
            this.draggedCircle = piece;
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
                this.executeMove(piece, move, true);
                return true;
            }
        }
        return false;
    }

    tryRegularMove(computerPieces) {
        // מערבב את החיילים בצורה רנדומלית
        computerPieces.sort(() => Math.random() - 0.5);

        for (let piece of computerPieces) {
            this.draggedCircle = piece;
            const row = parseInt(piece.dataset.row);
            const col = parseInt(piece.dataset.col);
            const validMoves = getValidMoves(piece, row, col);

            const possibleMoves = validMoves.filter(move => {
                const targetCell = document.querySelector(
                    `.cell[data-row="${move.row}"][data-col="${move.col}"]`
                );
                return targetCell && !targetCell.firstChild;
            });

            if (possibleMoves.length > 0) {
                const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                this.executeMove(piece, move, false);
                return true;
            }
        }
        return false;
    }

    executeMove(piece, move, isEating) {
        const targetCell = document.querySelector(
            `.cell[data-row="${move.row}"][data-col="${move.col}"]`
        );

        if (isEating) {
            const middleRow = (parseInt(piece.dataset.row) + move.row) / 2;
            const middleCol = (parseInt(piece.dataset.col) + move.col) / 2;
            const middleCell = document.querySelector(
                `.cell[data-row="${middleRow}"][data-col="${middleCol}"]`
            );

            if (middleCell && middleCell.firstChild) {
                middleCell.removeChild(middleCell.firstChild);
                matrix[middleRow][middleCol] = 0;
            }
        }

        targetCell.appendChild(piece);
        piece.dataset.row = move.row.toString();
        piece.dataset.col = move.col.toString();
        checkForKing(piece, move.row);
    }
}