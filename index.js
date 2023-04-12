const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 6:9 ratio
canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png'
})

const player = new Fighter({
    color: 'blue',
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
});

const enemy = new Fighter({
    color: 'red',
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    }
});

const keys = {
    a: { 
        pressed: false
    },
    d: { 
        pressed: false
    },
    w: { 
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

function rectangularColision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector('#result').style.display = 'flex';
    if (player.health == enemy.health){
        document.querySelector('#result').innerHTML = 'Tie';
    } else if (player.health > enemy.health) {
        document.querySelector('#result').innerHTML = 'Player Won';
    } else if (player.health < enemy.health) {
        document.querySelector('#result').innerHTML = 'Enemy Won';
    }
}

let timer = 51;
let timerId;
function decreaseTimer() {
    if (timer > 0){
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({player, enemy, timerId});
    }
}

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    background.update();

    player.update();
    enemy.update();

    // player movement
    player.velocity.x = 0;
    if (keys.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 5;
    }

    // enemy movement        
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    // detect colisions
    if (rectangularColision({
            rectangle1: player,
            rectangle2: enemy 
    }) && player.isAttacking
    ) {
        player.isAttacking = false;
        // console.log('enemy hit');
        enemy.health -= 20;
        document.querySelector('#enemy-current-health').style.width = enemy.health + '%';
    }

    if (rectangularColision({
            rectangle1: enemy,
            rectangle2: player 
    }) && enemy.isAttacking
    ) {
        enemy.isAttacking = false;
        // console.log('player hit');
        player.health -= 20;
        document.querySelector('#player-current-health').style.width = player.health + '%';
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId});
    }
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            player.velocity.y = -20;
            break;
        case ' ':
            player.attack();
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20;
            break;
        case 'ArrowDown':
            enemy.attack();
            break;

    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
    }
})