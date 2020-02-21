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

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId];

            if (fruit.x === player.x && fruit.y === player.y) {
                console.log(`COLLISION between ${playerId} and ${fruitId}`);

                removeFruit({fruitId: fruitId});
            }
        }
    }

    function movePlayer(command) {
        console.log(`Moving ${command.playerId} with ${command.keyPressed}`);

        const acceptedMoves = {
            ArrowUp: function(player) {
                if (player.y > 0) player.y--;
                return;
            },
            ArrowDown: function(player) {
                if (player.y < screen.height - 1) player.y++;
                return;
            },
            ArrowLeft: function(player) {
                if (player.x > 0) player.x--;
                return;
            },
            ArrowRight: function(player) {
                if (player.x < screen.width - 1) player.x++;
                return;
            },
        };

        const keyPressed = command.keyPressed;
        const player = state.players[command.playerId];
        const moveFunction = acceptedMoves[keyPressed];

        if (player && moveFunction) {
            moveFunction(player);
            checkFruitCollision(command.playerId);
        }

        return;
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

        for (const observerFunction of state.observers) {
            observerFunction(command);
        }
    }

    document.addEventListener('keydown', handleKeydown);

    function handleKeydown(event) {
        const key = event.key;

        const command = {playerId: 'player1', keyPressed: key};

        notifyAll(command);
        return;
    }

    return {
        subscribe,
    };
}

/* CAMADA APRESENTAÇÃO */
function renderScreen() {
    context.fillStyle = 'white';
    context.clearRect(0, 0, 10, 10);

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];

        context.fillStyle = 'black';
        context.fillRect(player.x, player.y, 1, 1);
    }

    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];

        context.fillStyle = 'green';
        context.fillRect(fruit.x, fruit.y, 1, 1);
    }

    requestAnimationFrame(renderScreen);
}
