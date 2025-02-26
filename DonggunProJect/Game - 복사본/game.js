let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, BulletImage, EnemyImage, gameoverImage;

let gameover = false; // true이면 게임이 끝남, false이면 게임이 안끝남
let score = 0;
// 우주선 좌표
let spaceshipX = canvas.width / 2 - 30;
let spaceshipY = canvas.height - 60;

let bulletList = []; //총알을 저장하는 리스트
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 18;
    this.y = spaceshipY;
    this.alive = true; // true면 살아있는 총알, false면 죽은 총알
    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 7;
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 40
      ) {
        // 총알에 죽게됨 적군의 우주선이 없어짐, 점수 획득
        score++;
        this.alive = false; //죽은 총알
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

let enemyList = [];
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 32);
    enemyList.push(this);
  };
  this.update = function () {
    this.y += 1.5; // 적군의 속도 조절

    if (this.y >= canvas.height - 32) {
      gameover = true;
      console.log("gameover");
    }
  };
}
function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.jpg";

  spaceshipImage = new Image();
  spaceshipImage.src = "images/spaceship.png";

  BulletImage = new Image();
  BulletImage.src = "images/Bullet.png";

  EnemyImage = new Image();
  EnemyImage.src = "images/Enemy.png";

  gameoverImage = new Image();
  gameoverImage.src = "images/gameover.jpg";
}
let keysDown = {};
function setupKeyboerdListener() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });

  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
    if (event.keyCode == 32) {
      createBullet(); //총알생성
    }
  });
}

function createBullet() {
  console.log("총알생성");
  let b = new Bullet(); // 총알 하나 생성
  b.init();
  console.log("새로운 총알 리스트", bulletList);
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000);
}

function update() {
  if (39 in keysDown) {
    spaceshipX += 5; // 우주선의 속도
  } // right
  if (37 in keysDown) {
    spaceshipX -= 5;
  } // left

  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }

  if (spaceshipX >= canvas.width - 60) {
    spaceshipX = canvas.width - 60;
  }
  // 우주선의 좌표값이 무한대로 업데이트가 되는게 아닌 경기장 밖으로 이탈하지 않게

  //총알의 y좌표 업데이트하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(
        BulletImage,
        bulletList[i].x,
        bulletList[i].y,
        BulletImage.width / 2,
        BulletImage.height / 2
      );
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(EnemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if (!gameover) {
    update(); // 좌표값을 업데이트하고
    render(); // 그려주고
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameoverImage, 10, 100, 380, 380);
  }
}

loadImage();
setupKeyboerdListener();
createEnemy();
main();
