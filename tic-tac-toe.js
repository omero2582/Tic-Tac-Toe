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
    let p1 = Player ('Player 1', 'X');
    let p2 = Player ('Player 2', '0');
    let playerArray = [p1, p2];
    let currentPlayer = p1;
    let gameState;


    const markAt = (index) => {         //maybe move this into Player also ?, think of it as Turn based, and player.attack()
                                        // eventListener should maybe start from the currentPlayer's markAt, then 
                                        //that will ASK the game's markAt if they are allowed to play there
                                        // NVM this would make redundant code cause the event listener would reference currentPlayer.attack()
                                        // then this player would ask 'Game' to verify if they are currentPlayer.... which they obv are..
                                        // new TODO: maybe put this inside Gameboard..that way we dont have to expose setSquare() from Gamebnopard
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
                displayController.renderPlayerDisplays();
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

    const getPlayerArray = () => playerArray;

    const getGameState = () => gameState;

    const checkWin = () => {
            
            //check the 3 rows
            //0 1 2,    345,    6 7 8
            for (let i = 0; i<9; i+=3){
                let symbol = Gameboard.getSquare(i);
                let nextSymbols = [Gameboard.getSquare(i+1), Gameboard.getSquare(i+2)];     
                if (symbol && nextSymbols.every( next => next == symbol)){
                    console.log('row');
                    //return (symbol == p1.getSymbol()) ? p1 : p2;
                    return playerArray.find( player => symbol == player.getSymbol());
                }
            }

            //check the 3 columns
            //0 3 6,    1 4 7,  2 5 8
            for (let i = 0; i<3; i++){
                let symbol = Gameboard.getSquare(i);
                let nextSymbols = [Gameboard.getSquare(i+3), Gameboard.getSquare(i+6)];
                if(symbol && nextSymbols.every( next => next == symbol)){ 
                    console.log(`column ${i} = ${i+3} = ${i+6} with ${symbol} = ${Gameboard.getSquare(i+3)} = ${Gameboard.getSquare(i+6)}`);
                    //return (symbol == p1.getSymbol()) ? p1: p2;
                    return playerArray.find( player => symbol == player.getSymbol());
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
                    //  return (symbol == p1.getSymbol()) ? p1 : p2;
                    return playerArray.find( player => symbol == player.getSymbol());
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

    return {markAt, switchPlayers, getCurrentPlayer, getPlayerArray};
})();

const displayController = (() => {
    const grid = document.querySelector('.game');
    const p1Name = document.querySelector('.p1-name');
    const p2Name = document.querySelector('.p2-name');
    const p1Wins = document.querySelector('.p1-wins');
    const p2Wins = document.querySelector('.p2-wins');

    const renderGameBoard = () => {
        grid.innerHTML = "";
        const gameBoard = Gameboard.getGameBoard();
        console.log('render');
        gameBoard.forEach( (square, index) =>{
            let squareDOM = document.createElement('div');
            squareDOM.classList.add('gameSquare');
            squareDOM.setAttribute('data-key', index);
            squareDOM.addEventListener('click', e => Game.markAt(index));
            squareDOM.textContent = square || "";
            grid.appendChild(squareDOM);
        });
    }

    const renderPlayerDisplays = () => {
        p1Name.textContent = Game.getPlayerArray()[0].getName();
        p1Wins.textContent = Game.getPlayerArray()[0].getWins();
        p2Name.textContent = Game.getPlayerArray()[1].getName();
        p2Wins.textContent = Game.getPlayerArray()[1].getWins();
    };

    renderGameBoard();
    renderPlayerDisplays();

    return {renderGameBoard, renderPlayerDisplays}
})();