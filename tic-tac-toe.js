const Gameboard = (() => {
    let board = new Array(9).fill(null);
    const getGameBoard = () => board;
    const setSquare = (index, symbol) => {
        board[index] = symbol;
    };
    const getSquare = (index) => board[index];
    const resetBoard = () => board = new Array(9).fill(null);

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
    const setName = (newName) => name = newName;
    const setSymbol = (newSymbol) => symbol = newSymbol;

    return {getName, getSymbol, getWins, addWins, setName, setSymbol};
};


const Game = (() => {
    let p1 = Player ('P1', 'X');
    let p2 = Player ('P2', '0');
    let currentPlayer = p1;
    let gameState;
    displayController.renderGameBoard();

    const markAt = (index) => {         //maybe mnove this into Player also ?, think of it as Turn based, and player.attack()
                                        // eventListener should maybe start from the currentPlayer's markAt, then 
                                        //that will ASK the game's markAt if they are allowed to play there
                                        // NVM this would make redundant code cause the event listener would reference currentPlayer.attack()
                                        // then this player would ask 'Game' to verify if they are currentPlayer.... which they obv are..
        let symbol = getCurrentPlayer().getSymbol();
        let square = Gameboard.getSquare(index);
        if (square == null){
            console.log(`marking at ${index}`);
            Gameboard.setSquare(index, symbol);
            let winner = checkWin();
            if (winner == "playing"){
                //still playing
                console.log("still playing");
                switchPlayers();    //add css class to this player
            }else if (winner == 'draw'){
                console.log('draw');
            }else{
                // someone won... how do i keep track of winners/# of wins?? on game or gameboard ? also enable a newgame button
                console.log(`${winner.getName()} wins with ${winner.getSymbol()}`);
                winner.addWins();
            }
            displayController.renderGameBoard();
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
            // return win ? make hp variable in each player ? dont know
            //TODO maybe replace these checks with putting the sqaures its comparing against in an array , then use arrays.every()
            //TODO prob also move these functions around... maybe in gameboard,, dont know but need to clean overall  
            
            //check the 3 rows
            //0 1 2,    345,    6 7 8
            for (let i = 0; i<9; i+=3){
                let symbol = Gameboard.getSquare(i);
                let nextSymbols = [Gameboard.getSquare(i+1), Gameboard.getSquare(i+2)];     
                if (symbol && nextSymbols.every( next => next == symbol)){
                    console.log('row');
                    return (symbol == p1.getSymbol()) ? p1 : p2;
                }
            }

            //check the 3 columns
            //0 3 6,    1 4 7,  2 5 8
            for (let i = 0; i<3; i++){
                let symbol = Gameboard.getSquare(i);
                let nextSymbols = [Gameboard.getSquare(i+3), Gameboard.getSquare(i+6)];
                if(symbol && nextSymbols.every( next => next == symbol)){ 
                    console.log(`column ${i} = ${i+3} = ${i+6} with ${symbol} = ${Gameboard.getSquare(i+3)} = ${Gameboard.getSquare(i+6)}`);
                    return (symbol == p1.getSymbol()) ? p1: p2;
                } 
            }


            //check the 2 diagonals
            //0 4 8,     2 4 6
            let j = 4;
            for (let i = 0; i<3; i+=2){
                let symbol = Gameboard.getSquare(i);
                let nextSymbols = [ Gameboard.getSquare(i+j), Gameboard.getSquare(i+j+j)];
                if(symbol && nextSymbols.every( next => next == symbol) ){
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
    };

    return {markAt, switchPlayers, getCurrentPlayer};
})();


//TODO use an arrayList to contain the players instead of just p1 and p2
//then to fins winner, loop through it (prob array.find), to finds the matching symbol to the board squares...
// this simulates a 'what if we had X num of player for a diff game'
