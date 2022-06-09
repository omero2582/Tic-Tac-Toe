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
            squareDOM.addEventListener('click', e => Game.markAt(index));     //<---- YOU get ur feedback automaticaly when u render LOl
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

    const markAt = (index) => {         //maybe mnove this into Player also ?, think of it as Turn based, and player.attack()
                                        // eventListener should maybe start from the currentPlayer's markAt, then 
                                        //that will ASK the game's markAt if the player can play there. it shouldnt be the
                                        // other way around cause it more complicated re-checking player state again (3 checks vs 2)
                                        // it should be 
                                        //Player: 'hey game can i play here?'
                                        //Game: 'yes you can!, ok now i render, checkwin & switch player'
        let symbol = getCurrentPlayer().getSymbol();
        let square = Gameboard.getSquare(index);
        if (square == null){
            console.log(`marking at ${index}`);
            Gameboard.setSquare(index, symbol);

            displayController.renderGameBoard();
            //checkwin
            let winner = checkWin();
            if (winner == "playing"){
                //still playing
                console.log("still playing");
            }else if (winner == 'draw'){
                console.log(draw);
            }else{
                console.log(`${winner.getName()} wins with ${winner.getSymbol()}`);
                // someone won

            }
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
             // return win ? make hp variable in each player ? dont know
            //TODO maybe replace these checks with putting the sqaures its comparing against in an array , then use arrays.every()
            //TODO prob also move these functions around... maybe in gameboard,, dont know but need to clean overall  
            for (let i = 0; i<9; i+=3){
                let symbol = Gameboard.getSquare(i);
                if((symbol != null) && (symbol == Gameboard.getSquare(i+1) && symbol == Gameboard.getSquare(i+2)) ){
                    console.log('row');
                    return (symbol == p1.getSymbol()) ? p1 : p2;
                } 
            }

            //2 nested loops to check the 3 columns
            for (let i = 0; i<3; i++){
                let symbol = Gameboard.getSquare(i);
                if((symbol != null) && (symbol == Gameboard.getSquare(i+3) && symbol== Gameboard.getSquare(i+6)) ){ 
                    console.log(`column ${i} = ${i+3} = ${i+6}
                                    ${symbol} = ${Gameboard.getSquare(i+3)} = ${Gameboard.getSquare(i+6)}`);
                    return (symbol == p1.getSymbol()) ? p1: p2;
                } 
            }


            //2 nested loops to check the 2 diagonals
            for (let i = 0; i<3; i+=2){
                let j = 4;
                let symbol = Gameboard.getSquare(i);
                if((symbol != null) && (symbol == Gameboard.getSquare(i+j) && symbol == Gameboard.getSquare(i+j+j)) ){
                    console.log('diagonal');
                     return (symbol == p1.getSymbol()) ? p1 : p2;
                } 
                j -=2;
            }


            //checkDraw()
            //if gameboard has no nulls, then end
            if (Gameboard.getGameBoard().indexOf(null) == -1){
                return 'draw';
            }else{
                return 'playing';
            }


            //maybe put a checkRow() checkColumn, etc in the Gameboard obj itself.. yea probably better
    };

    return {markAt, switchPlayers, getCurrentPlayer};
})();





// TODO have to write this currentPlayer logic.. maybe difficult cause maybe the order of functions matters here dont know
//TODO Game's checkWin + renderGameBoard + ???,  prob put these into 1 function


