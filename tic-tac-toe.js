const Gameboard = (() => {
    let board = new Array(9).fill(null);
    const getGameBoard = () => board;
    const setSquare = (index, symbol) => {
        square = getSquare(index);
        if (square == null){
            console.log(`marking at ${index}`);
            board[index] = symbol;
            return true;   
        }else{
            console.log(`square at index ${index} is taken by ${square}`);
            return false;
        }
        
    };
    const getSquare = (index) => board[index];
    const resetBoard = () => board = new Array(9).fill(null);

    return {getGameBoard, setSquare, getSquare, resetBoard};
})();


const Player = (name, symbol) =>{
    let wins = 0;
    const getName = () => name;
    const getSymbol = () => symbol;
    const getWins = () => wins;
    const addWins = () => ++wins;
    const setName = (newName) => name = newName;
    const setSymbol = (newSymbol) => symbol = newSymbol;
    const resetWins = () => wins = 0;

    return {getName, getSymbol, getWins, addWins, setName, setSymbol, resetWins};
};


const Game = (() => {
    let p1 = Player ('Player 1', 'X');
    let p2 = Player ('Player 2', '0');
    let playerArray = [p1, p2];
    let currentPlayer = p1;
    let gameOver = false;


    const markAt = (index) => {         
        if (gameOver) {return};
        
        let symbol = getCurrentPlayer().getSymbol();
        if (Gameboard.setSquare(index, symbol)){
            let winner = checkWin();
            if (winner){
                gameOver = true;
                 console.log(`${winner.getName()} wins with ${winner.getSymbol()}`);
                 winner.addWins();
                 displayController.renderPlayerDisplays(); 
            }else if (checkDraw()){
                gameOver = true;
                console.log('draw');
            }else{
                console.log("still playing");
                switchPlayers();    //add css class to this player
            }
            displayController.renderGameBoard();
            return symbol;
        } //else invalid move

    };

    const switchPlayers= () =>{
        currentPlayer = (currentPlayer == p1) ? p2 : p1;
        console.log(`switched to ${currentPlayer.getName()}`);
    };

    const getCurrentPlayer = () => currentPlayer;

    const getPlayerArray = () => playerArray;

    const checkWin = () => {       
            //check the 3 rows
            //0 1 2,    345,    6 7 8
            for (let i = 0; i<9; i+=3){
                let indexArray = [i, i+1, i+2]; 
                if(isSameSymbolByIndex(indexArray)){ 
                    logSameSymbols(indexArray, 'row');
                    return findPlayerByIndex(i);
                }
            }

            //check the 3 columns
            //0 3 6,    1 4 7,  2 5 8
            for (let i = 0; i<3; i++){
                let indexArray = [i, i+3, i+6]; 
                if(isSameSymbolByIndex(indexArray)){ 
                    logSameSymbols(indexArray, 'column');
                    return findPlayerByIndex(i);
                } 
            }

            //check the 2 diagonals
            //0 4 8,     2 4 6
            let j = 4;
            for (let i = 0; i<3; i+=2){
                let indexArray = [i, i+j, i+j+j]; 
                if(isSameSymbolByIndex(indexArray)){ 
                    logSameSymbols(indexArray, 'diagonal');
                    return findPlayerByIndex(i);
                } 
                j -=2;    
            }
    };

    const logSameSymbols = (index, string) =>{
        console.log(`${string} ${index[0]} = ${index[1]} = ${index[2]} with ${Gameboard.getSquare(index[0])} = ${Gameboard.getSquare(index[1])} = ${Gameboard.getSquare(index[2])}`);
    };

    const isSameSymbol = (symbolArray) =>{
        //let firstSymbol = symbolArray.shift();      //dont use even though it will comapre vs itself since shift is prob an expensive operation
        return symbolArray[0] && symbolArray.every(symbol => symbol == symbolArray[0])
    };

    const isSameSymbolByIndex = (indexArray) => {
        let symbolArray = [Gameboard.getSquare(indexArray[0]), Gameboard.getSquare(indexArray[1]), Gameboard.getSquare(indexArray[2])];
        return isSameSymbol(symbolArray);
    };

    const findPlayerBySymbol = (symbol) =>{
        return playerArray.find(player => player.getSymbol() == symbol);
    };

    const findPlayerByIndex = (index) =>{
        return findPlayerBySymbol(Gameboard.getSquare(index));
    }

    const checkDraw = () => {
        return Gameboard.getGameBoard().indexOf(null) == -1;
    };

    const newRound = (string) => {
        gameOver = false;
        Gameboard.resetBoard();
        console.log(string);
        displayController.renderGameBoard();
    }
    
    const newGame = () =>{
        newRound('new Game');
        resetScore();
        displayController.renderPlayerDisplays();
    };

    const resetScore = () =>{
        playerArray.forEach(player => player.resetWins());
    };

    return {markAt, switchPlayers, getCurrentPlayer, getPlayerArray, newRound, newGame};
})();

const displayController = (() => {
    const grid = document.querySelector('.game');
    const p1Name = document.querySelector('.p1-name');
    const p2Name = document.querySelector('.p2-name');
    const p1Wins = document.querySelector('.p1-wins');
    const p2Wins = document.querySelector('.p2-wins');
    const newRound = document.querySelector('.new-round');
    const newGame = document.querySelector('.new-game');

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

    const renderGameFooter = () => {
        newRound.addEventListener('click', () => Game.newRound('new Round'));
        newGame.addEventListener('click', () => Game.newGame('new Game'));
    };

    renderGameBoard();
    renderPlayerDisplays();
    renderGameFooter();

    return {renderGameBoard, renderPlayerDisplays}
})();

//TODO  displayController.log, to log to a footer below the button section:
// 1 header main feeedback text, another one below it as a description