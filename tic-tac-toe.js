const Gameboard = (() => {
    let board = new Array(9).fill(null);
    const getGameBoard = () => board;
    const setSquare = (index, symbol) => {
        board[index] = symbol;
    };
    const getSquare = (index) => board[index];

    return {getGameBoard, setSquare, getSquare};
})();

const displayController = (() => {
    const grid = document.querySelector('.game');

    const renderGameBoard = () => {
        grid.innerHTML = "";
        const gameBoard = Gameboard.getGameBoard();
        console.log('render');
        gameBoard.forEach( (square, index) =>{
            let squareDOM = document.createElement('div');
            squareDOM.classList.add('gameSquare');
            squareDOM.setAttribute('data-key', index);
            squareDOM.addEventListener('click', e => Game.markAt(index, Game.getCurrentPlayer().getSymbol()));     //<---- YOU get ur feedback automaticaly when u render LOl
            squareDOM.textContent = square || "";
            grid.appendChild(squareDOM);
        });
    }
    // renderGameBoard(); moved to Game. Think its better that way
    return {renderGameBoard}
})();

const Player = (name, symbol) =>{
    let wins = 0;
    const getName = () => name;
    const getSymbol = () => symbol;
    const getWins = () => wins;
    const addWins = () => ++wins;

    return {getName, getSymbol, getWins, addWins};
};


const Game = (() => {
    let p1 = Player ('p1', 'X');
    let p2 = Player ('p2', '0');
    let currentPlayer = p1;
    let gameState;
    displayController.renderGameBoard();

    const markAt = (index, symbol) => {         //maybe mnove this into Player, OR have both, one here, one in player
                                                // think of it as Turn based, and player.attack()
        let square = Gameboard.getSquare(index);
        if (square == null){
            console.log(`marking at ${index}`);
            Gameboard.setSquare(index, symbol);

            displayController.renderGameBoard();
            //checkwin
            switchPlayers();
            return symbol;
        }else{
            console.log(`square at index ${index} is taken by ${square}`);
            return null;
        }
    };

    const switchPlayers= () =>{
        currentPlayer = (currentPlayer == p1) ? p2 : p1;
        console.log(`switched to ${currentPlayer.getName()}`);
    };

    const getCurrentPlayer = () => currentPlayer;

    const getGameState = () => gameState;

    const checkWin = () => {
            //2 nested loops to check the 3 rows
            let gameboard = Gameboard.getGameBoard();
            let win = false;    // maybe not like this, maybe just 'return true' upon win, this way we dont have to unnecessarily keep checking lines of code
            for (let i = 0; i<9; i+=3){
                
                //if () TODO WTF how do i check which player won, i dont like any of the ideas i came up wtih
                Gameboard.getSquare(i);
                Gameboard.getSquare(i+1);
                Gameboard.getSquare(i+2);
            }

            for (let j = 0; j<3; j++){
                Gameboard.getSquare(i+j);
            }


            //2 nested loops to check the 3 colums
            //2 nested loops to check the 2 diagonals
    };

    return {markAt, switchPlayers, getCurrentPlayer};
})();





// TODO have to write this currentPlayer logic.. maybe difficult cause maybe the order of functions matters here dont know
//TODO Game's checkWin + renderGameBoard + ???,  prob put these into 1 function


