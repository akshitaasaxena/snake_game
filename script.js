
function gamestart() {
    const canvas = document.getElementById('gamecanvas');
    const ctx = canvas.getContext('2d');
    const gridsize = 20;
    const tileCount = 20;

    let snake = [{ x: 10, y: 10 }];//array of objects
    let direction = 'RIGHT';
    let food = { x: 15, y: 10 };
    let score = 0;
    let gamespeed = 200;
    let eatfood = new Audio("eat.mp3");
    JSON.stringify(localStorage.setItem("highscore", 0));
    let highscore = JSON.parse(localStorage.getItem("highscore"));


    function grid() {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#363"

        for (let x = 0; x <= canvas.width; x += gridsize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();

        }
        for (let y = 0; y <= canvas.height; y += gridsize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    function draw() {
        //clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        grid(); //calling function of drawing grids over the canvas

        //Draw snake (green)
        ctx.fillStyle = '#00FF00';
        snake.forEach(segment => {
            ctx.fillRect(
                segment.x * gridsize,
                segment.y * gridsize,
                gridsize - 2, //height:(20-2)=18->to avoid false collision assumption
                gridsize - 2
            );
        });

        //Draw food(Red)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(
            food.x * gridsize,
            food.y * gridsize,
            gridsize - 2, gridsize - 2);

        ctx.fillText("HighScore " + highscore, 280, 20);
           ctx.fillText("Score " + score, 10, 20);



    }

    function move() {
        //copy head position 
        let head = {
            x: snake[0].x,
            y: snake[0].y
        }
        if (direction == 'UP') head.y--;
        if (direction == 'DOWN') head.y++;
        if (direction == 'LEFT') head.x--;
        if (direction == 'RIGHT') head.x++;

        //add new head to front 
        snake.unshift(head);

        //check if food is eaten 
        if (head.x === food.x && head.y === food.y) {
            score++;
             if (highscore < score)
            highscore = score;

            if (score % 5 == 0) gamespeed -= 5;
            eatfood.play();
            placeFood();
        }
        else {
            snake.pop();//remove tail
        }
    }
    //key down is the fastest among key up, key press, key down
    document.addEventListener('keydown', changedirection);
    function changedirection(event) {
        const key = event.key;
        //prevents 180 turns -> Snake can't move up when it's going down
        if (key == 'ArrowUp' && direction != 'DOWN')
            direction = 'UP';

        if (key == 'ArrowDown' && direction != 'UP')
            direction = 'DOWN';

        if (key == 'ArrowLeft' && direction != 'RIGHT')
            direction = 'LEFT';

        if (key == 'ArrowRight' && direction != 'LEFT')
            direction = 'RIGHT';
    }

    function checkCollision() {
        const head = snake[0];

        //WALL COLLISION
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount)
            return true;

        //SELF COLLISION
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y)
                return true;
        }
        return false;
    }

    function placeFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);

    }

    function gameloop() {
        //update game state
        move();

        //check if game is over
        if (checkCollision()) {
            alert('Game over ! Score : ' + score);

            //reset game
            snake = [{ x: 10, y: 10 }];
            direction = "RIGHT";
            score = 0;
            placeFood();
        }

        //draw everything
        draw();

        //schedule next frame
        setTimeout(gameloop, gamespeed);
    }
    //START THE GAME!
    placeFood();
    gameloop();
}
