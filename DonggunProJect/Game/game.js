let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, BulletImage, EnemyImage, gameoverImage;

let gameover = false; // 게임 상태 확인 변수
let score = 0; // 점수 저장 변수

// 우주선 좌표
let spaceshipX = canvas.width / 2 - 30;
let spaceshipY = canvas.height - 60;

// 총알 리스트
let bulletList = [];

function Bullet() {
  this.x = 0;
  this.y = 0;
  this.alive = true; // 총알 상태

  this.init = function () {
    this.x = spaceshipX + 18;
    this.y = spaceshipY;
    bulletList.push(this);
  };

  this.update = function () {
    this.y -= 7;
    this.checkHit();
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      // 충돌 체크는 적이 화면에 들어온 이후에만 작동하도록 설정
      if (
        this.y <= enemyList[i].y + 32 &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 40 &&
        enemyList[i].inScreen
      ) {
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
        break;
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
  this.inScreen = false; // 적이 화면에 들어왔는지 여부

  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 32);
    enemyList.push(this);
  };

  this.update = function () {
    this.y += 1.5; // 적군의 속도 조절

    // 적이 화면에 들어온 경우에만 충돌 검사 및 게임 오버 체크를 허용
    if (this.y > 32) {
      this.inScreen = true;
    }

    if (this.y >= canvas.height - 32 && this.inScreen) {
      gameover = true;
      console.log("Game Over");
    }
  };
}

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "./images/background.jpg";

  spaceshipImage = new Image();
  spaceshipImage.src = "./images/spaceship.png";

  BulletImage = new Image();
  BulletImage.src = "./images/Bullet.png";

  EnemyImage = new Image();
  EnemyImage.src = "./images/Enemy.png";

  gameoverImage = new Image();
  gameoverImage.src = "./images/gameover.jpg";
}

let keysDown = {};

function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });

  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
    if (event.keyCode === 32) {
      createBullet(); // 스페이스바로 총알 생성
    }
  });
}

function createBullet() {
  let b = new Bullet();
  b.init();
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000);
}

function update() {
  if (39 in keysDown) {
    spaceshipX += 5; // 우주선 이동 속도
  }
  if (37 in keysDown) {
    spaceshipX -= 5;
  }

  // 우주선이 화면 밖으로 나가지 않도록 경계 설정
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 60) {
    spaceshipX = canvas.width - 60;
  }

  // 총알 업데이트 및 제거
  bulletList.forEach((bullet) => {
    if (bullet.alive) {
      bullet.update();
    }
  });
  bulletList = bulletList.filter((bullet) => bullet.alive);

  // 적군 업데이트
  enemyList.forEach((enemy) => enemy.update());
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  bulletList.forEach((bullet) => {
    if (bullet.alive) {
      ctx.drawImage(
        BulletImage,
        bullet.x,
        bullet.y,
        BulletImage.width / 2,
        BulletImage.height / 2
      );
    }
  });

  enemyList.forEach((enemy) => {
    ctx.drawImage(EnemyImage, enemy.x, enemy.y);
  });
}

function main() {
  if (!gameover) {
    update(); // 좌표 업데이트
    render(); // 화면 렌더링
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameoverImage, 10, 100, 380, 380);
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
