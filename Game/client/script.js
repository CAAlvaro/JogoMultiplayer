const screen = document.getElementById('screen');
const context = screen.getContext('2d');

const game = createGame();
const keyboardListener = createKeyboardListener();
keyboardListener.subscribe(game.movePlayer);

renderScreen();

/* CAMADA LOGICA E DADOS */
function createGame() {
    const state = {
        players: {
            player1: { x: 1, y: 1 },
            player2: { x: 9, y: 9 }
        },
        fruits: {
            fruit1: { x: 3, y: 1 }
        }
    }

    function movePlayer(command) {
        console.log(`Moving ${command.playerId} with ${command.keyPressed}`);
        
        const keyPressed = command.keyPressed;
        const player = state.players[command.playerId];

        if (keyPressed == 'ArrowUp') {
            player.y--;
            return;
        }

        if (keyPressed == 'ArrowDown') {
            player.y++;
            return;
        }

        if (keyPressed == 'ArrowLeft') {
            player.x--;
            return;
        }

        if (keyPressed == 'ArrowRight') {
            player.x++;
            return;
        }

    }

    return {
        movePlayer,
        state
    }
}

/* CAMADA INPUT */
function createKeyboardListener() {
    const state = {
        observers: [],
    }

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

        const command = { playerId: 'player1', keyPressed: key };

        notifyAll(command);
        return;
    }

    return {
        subscribe
    }
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
