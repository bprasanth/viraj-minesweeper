// Script.js
let numRows = 9;
let numCols = 9;
let numMines = 10;

let seconds = 0;
const timerDiv = document.getElementById("timer");
let timer;
function startTimer() {
    timer = setInterval(function() {
        seconds ++;
        timerDiv.textContent = ''+seconds;
    }, 1000);
}


const gameBoard =
    document.getElementById(
        "gameBoard"
    );
let board = [];
let gameOver = false;
function initializeBoard() {
    seconds  = 0;
    if(timer) clearInterval(timer);
    startTimer();
    gameOver = false;
    for (let i = 0; i < numRows; i++) {
        board[i] = [];
        for (
            let j = 0;
            j < numCols;
            j++
        ) {
            board[i][j] = {
                isMine: false,
                revealed: false,
                count: 0,
                flagged: false
            };
        }
    }

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const row = Math.floor(
            Math.random() * numRows
        );
        const col = Math.floor(
            Math.random() * numCols
        );
        if (!board[row][col].isMine) {
            board[row][
                col
                ].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate counts
    for (let i = 0; i < numRows; i++) {
        for (
            let j = 0;
            j < numCols;
            j++
        ) {
            if (!board[i][j].isMine) {
                let count = 0;
                for (
                    let dx = -1;
                    dx <= 1;
                    dx++
                ) {
                    for (
                        let dy = -1;
                        dy <= 1;
                        dy++
                    ) {
                        const ni =
                            i + dx;
                        const nj =
                            j + dy;
                        if (
                            ni >= 0 &&
                            ni <
                            numRows &&
                            nj >= 0 &&
                            nj <
                            numCols &&
                            board[ni][
                                nj
                                ].isMine
                        ) {
                            count++;
                        }
                    }
                }
                board[i][j].count =
                    count;
            }
        }
    }
}

function revealCell(row, col) {
    if(gameOver) return;
    if (
        row < 0 ||
        row >= numRows ||
        col < 0 ||
        col >= numCols ||
        board[row][col].revealed
    ) {
        return;
    }

    board[row][col].revealed = true;

    if (board[row][col].isMine) {
        // Handle game over
        alert(
            "Game Over! You stepped on a mine."
        );
        gameOver = true;
        if(timer)
        clearInterval(timer);
    } else if (
        board[row][col].count === 0
    ) {
        // If cell has no mines nearby,
        // Reveal adjacent cells
        for (
            let dx = -1;
            dx <= 1;
            dx++
        ) {
            for (
                let dy = -1;
                dy <= 1;
                dy++
            ) {
                revealCell(
                    row + dx,
                    col + dy
                );
            }
        }
    }

    renderBoard();
}

function renderBoard() {
    gameBoard.innerHTML = "";
    let revealedCount = 0;

    for (let i = 0; i < numRows; i++) {
        for (
            let j = 0;
            j < numCols;
            j++
        ) {
            const cell =
                document.createElement(
                    "div"
                );
            cell.className = "cell";
            if (
               !board[i][j].revealed && board[i][j].flagged
            ) {
                cell.classList.add(
                    "flag"
                );

            }
            if (board[i][j].revealed) {
                revealedCount ++;
                cell.classList.add(
                    "revealed"
                );
                if (
                    board[i][j].isMine
                ) {
                    cell.classList.add(
                        "mine"
                    );

                }
                else if (
                    board[i][j].count >
                    0
                ) {
                    cell.classList.add(
                        getCountClass(""+board[i][j].count)
                    );
                    cell.textContent =
                        board[i][
                            j
                            ].count;
                }
            }
            cell.addEventListener(
                "click",
                () => revealCell(i, j)
            );
            cell.addEventListener(
                'contextmenu',
                (ev) => {
                    ev.preventDefault();
                    addFlag(board[i][j], cell);
                    return false;
                }, false
            );
            gameBoard.appendChild(cell);
        }
        gameBoard.appendChild(
            document.createElement("br")
        );
    }
    if( revealedCount + numMines == (numRows*numCols)) {
        alert( 'You WON!');
        gameOver = true;
        if(timer) clearInterval(timer);
    }

}

function getCountClass(count) {

    let classes = {
        "1": "one",
        "2": "two",
        "3": "three",
        "4": "four",
        "5": "five",
        "6": "six",
        "7": "seven",
        "8": "eight"
    };
    return classes[count];
}

function addFlag(boardObj , cell) {
    if(boardObj.revealed) return;
    boardObj.flagged = !boardObj.flagged;
    cell.classList.add(
        "flag"
    );
}
function beginner() {
    numRows = 9;
    numCols = 9;
    numMines = 10;
    initializeBoard();
    renderBoard();
}

function intermediate() {
    numRows = 16;
    numCols = 16;
    numMines = 40;
    initializeBoard();
    renderBoard();

}

function expert() {
    numRows = 16;
    numCols = 30;
    numMines = 100;
    initializeBoard();
    renderBoard();

}


function restart() {
 initializeBoard();
 renderBoard();
}



initializeBoard();
renderBoard();
