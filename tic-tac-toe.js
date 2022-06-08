let grid = document.querySelector('.game');

const displayController = (() => {
    
    const renderAllSquares = () =>{

        for (let i=0; i<9; i++){
            let square = document.createElement('div');
            square.classList.add('gameSquare');
            square.setAttribute('data-key', i);
            square.addEventListener('click', e => {
                if (Game.markAt(i, 'X')){
                    markAt(square, 'X');
                }
            });
            grid.appendChild(square);
        }        
    }

    const markAt = (square, symbol) => {
        // let square = document.querySelector(`div[data-key="${index}"]`);
        square.textContent = symbol;
    }
    
    return {markAt, renderAllSquares}
})();

displayController.renderAllSquares();

const Game = (() => {

    const markAt = (index, symbol) => {
        if (Gameboard.getGameBoard()[index] != null){
            return null
        }else{
            Gameboard.getGameBoard()[index] = symbol;
            return symbol;
        }
    }

    return {markAt};
})();

const Gameboard = (() => {
    let board = new Array(9).fill(null);
    

    const getGameBoard = () => board;

    return {getGameBoard};
})();

const Player = (name, symbol) =>{
    let wins = 0;
    const getName = () => name;
    const getSymbol = () => symbol;
    const getWins = () => wins;
    const addWins = () => ++wins;

    return {getName, getSymbol, getWins, addWins};
}