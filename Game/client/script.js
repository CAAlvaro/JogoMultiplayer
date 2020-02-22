const screen = document.getElementById('screen');
const context = screen.getContext('2d');

const game = createGame();
const keyboardListener = createKeyboardListener();
keyboardListener.subscribe(game.movePlayer);

game.addPlayer({
  playerId: 'player1',
  playerX: 0,
  playerY: 0,
});

game.addFruit({
  fruitId: 'fruit1',
  fruitX: 5,
  fruitY: 5,
});

renderScreen();

/* CAMADA LOGICA E DADOS */
function createGame() {
  const state = {
    players: { },
    fruits: { },
  };

  function addPlayer(command) {
    state.players[command.playerId] = {
      x: command.playerX,
      y: command.playerY,
    };
  }

  function removePlayer(command) {
    delete state.players[command.playerId];
  }

  function addFruit(command) {
    state.fruits[command.fruitId] = {
      x: command.fruitX,
      y: command.fruitY,
    };
  }

  function removeFruit(command) {
    delete state.fruits[command.fruitId];
  }

  function checkFruitCollision(playerId) {
    const player = state.players[playerId];

    Object.keys(state.fruits).forEach((fruitId) => {
      const fruit = state.fruits[fruitId];

      if (fruit.x === player.x && fruit.y === player.y) {
        console.log(`COLLISION between ${playerId} and ${fruitId}`);

        removeFruit({ fruitId });
      }
    });
  }

  function movePlayer(command) {
    console.log(`Moving ${command.playerId} with ${command.keyPressed}`);

    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y > 0) player.y--;
      },
      ArrowDown(player) {
        if (player.y < screen.height - 1) player.y++;
      },
      ArrowLeft(player) {
        if (player.x > 0) player.x--;
      },
      ArrowRight(player) {
        if (player.x < screen.width - 1) player.x++;
      },
    };

    const { keyPressed } = command;
    const player = state.players[command.playerId];
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkFruitCollision(command.playerId);
    }
  }

  return {
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    movePlayer,
    state,
  };
}

/* CAMADA INPUT */
function createKeyboardListener() {
  const state = {
    observers: [],
  };

  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  function notifyAll(command) {
    console.log(`Notifying ${state.observers.length} observers.`);

    state.observers.forEach((observerFunction) => {
      observerFunction(command);
    });
  }

  document.addEventListener('keydown', handleKeydown);

  function handleKeydown(event) {
    const { key } = event;

    const command = { playerId: 'player1', keyPressed: key };

    notifyAll(command);
  }

  return {
    subscribe,
  };
}

/* CAMADA APRESENTAÇÃO */
function renderScreen() {
  context.fillStyle = 'white';
  context.clearRect(0, 0, 10, 10);

  Object.keys(game.state.players).forEach((playerId) => {
    const player = game.state.players[playerId];

    context.fillStyle = 'black';
    context.fillRect(player.x, player.y, 1, 1);
  });

  Object.keys(game.state.fruits).forEach((fruitId) => {
    const fruit = game.state.fruits[fruitId];

    context.fillStyle = 'green';
    context.fillRect(fruit.x, fruit.y, 1, 1);
  });

  requestAnimationFrame(renderScreen);
}
