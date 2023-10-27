const game = {
  movesMap: [
    null, null, null,
    null, null, null,
    null, null, null
  ],

  scores:{
    player: 0,
    cpu: 0,
    tie: 0,
  },

  increaseScore: turn => {
    const resultElem = document.body.querySelector('.js-result');
    if(turn === 'player'){
      game.scores.player++;
      resultElem.innerHTML = `<div onclick="restartGame()" class = "result">You win! click <div class="restart js-restart">here</div> to restart</div>`; 
      return;
    }
    if(turn ==='cpu'){
      game.scores.cpu++;
      resultElem.innerHTML = `<div onclick="restartGame()" class = "result">Opponent wins!. click <div class="restart js-restart">here</div> to restart</div>`;
      return;
    }
    resultElem.innerHTML = `<div onclick="restartGame()" class = "result">Tie!. click <div class="restart js-restart">here</div> to restart</div>`;
    game.scores.tie++;
  },

  resetScore: () => {
    game.scores.player = 0;
    game.scores.cpu = 0;
    game.scores.tie = 0;
  },

  isFull: () => {
    for(let i = 0; i < game.movesMap.length; i++){
      if(game.movesMap[i] === null) return false;
    };
    return true;
  },  
};

const moveBtnElems = document.querySelectorAll('.js-move-btn');

function pickComputerMove(){ //recursive function
  const cpuMove = Math.floor(Math.random() * 9);
  //console.log(cpuMove);
  
  if(game.isFull()){  //checks if there are no more moves to pick
    return false;
  } 
  if(game.movesMap[cpuMove] === null){
    const btnElem = moveBtnElems.item(cpuMove);
    btnElem.innerHTML = `
      <img class="cpu-move-icon" src = "assets/images/player-icons/elon01.png">
    `;

    game.movesMap[cpuMove] = 'cpu';
    return true; //cpu turn has ended
  }
  else{
    //console.log('RECURSION');
    pickComputerMove();
  }
}

function pickPlayerMove(btnElem , key){
  if(btnElem.innerHTML === ''){
    btnElem.innerHTML = `
    <img class= "player-move-icon" src ="assets/images/player-icons/zuck01.png">
    `;
    game.movesMap[key] = 'player';
    return true //player turn has ended
  }

  return false //player picked an already occupied move(by either the player themselves or the computer)
}

function check(turn){
  
  //scans the map by each column from right to left
  let ptr1 = 0, ptr2 = 3, ptr3 = 6;
  let i = 0;
  const map = game.movesMap;
  while(i <= 2){
    if(map[ptr1]=== turn && map[ptr2]=== turn && map[ptr3] === turn){
      //win
      //console.log('columns scanned');
      game.increaseScore(turn);
      return true;
    }
    ptr1++, ptr2++, ptr3++; 
    i++;
  }
  
  //scans the map by each row from top to bottom.
  i = 0;
  ptr1 = 0, ptr2 = 1, ptr3 = 2;
  while(i <= 2){
    if(map[ptr1]===turn && map[ptr2]===turn && map[ptr3] ===turn){
      //win
      //console.log('rows scanned');
      game.increaseScore(turn);
      return true;
    }
    ptr1 += 3, ptr2 += 3, ptr3 +=3; 
    i++;
  }
  
  //scans the map diagonally from bottom left to top right, 
  //and then from bottom right to top left.
  i = 0;
  ptr1 = 0, ptr2 = 4, ptr3 = 8;
  while(i <= 1){
    if(map[ptr1]===turn && map[ptr2]===turn && map[ptr3] ===turn){
      //win
      //console.log('diagonally scanned');
      game.increaseScore(turn);
      return true;
    }
    ptr1 = 2, ptr3 =6; 
    i++;
  }
  
  //tie
  if(game.isFull()){
    game.increaseScore();
    return false;
  }

  return null;
}

function renderScore(){
  const scoreElem = document.querySelector('.score');
  scoreElem.innerHTML = `You: ${game.scores.player}. CPU: ${game.scores.cpu}. Tie: ${game.scores.tie}.`
}

function restartGame(){
  const resultElem = document.body.querySelector('.js-result');
  game.movesMap.forEach((_move, index) => {
    game.movesMap[index] = null;
  });
  
  moveBtnElems.forEach( btnElem => {
    btnElem.innerHTML = ``;
    btnElem.removeAttribute('disabled');
  });

  resultElem.innerHTML = 'TicTacToe';
}

function playGame(btnElem, key){
  let hasPickedMove;
  
  hasPickedMove = pickPlayerMove(btnElem, key);
  if(hasPickedMove) {
    const hasWon = check('player');
    if(hasWon === true || hasWon === false){
      moveBtnElems.forEach( val => {
        val.setAttribute('disabled', '');
      });
      renderScore();
      return; //either the player wins or it's a tie, and therefore the game ends.
    } 
    if(hasWon === null); //player neither win or tie.the game continues.
  }
  else{
    console.log('pick somewhere else dumbass');
    return;
  } 
  
  
  hasPickedMove = null;
  
  hasPickedMove = pickComputerMove();
  if(hasPickedMove) {
    const hasWon = check('cpu');
    if(hasWon === true || hasWon === false){
      moveBtnElems.forEach( val => {
        val.setAttribute('disabled', '')
      });
      renderScore();
      return; //either the cpu wins or it's a tie, and therefore the game ends.
    } 
    if(hasWon === null);  //cpu neither win or tie. the game continues.
  }
  else return; //the computer didn't find anywhere to pick so it's already a tie.
}

moveBtnElems.forEach((val, key) =>{
  val.addEventListener('click', e =>{
    playGame(val, key);
  });
});