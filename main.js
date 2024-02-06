const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

class Arrow {
  constructor(size) {
    this.up = new Image(size, size);
    this.left = new Image(size, size);
    this.right = new Image(size, size);
    this.down = new Image(size, size);
    this.heart = new Image(size, size);
    this.score = 0;
    this.options = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    this.actual = null;
    this.drawSize = size;
    this.time = 0;
    this.life = 3;
    this.now = 0;
    this.win = false;
    this.lastScore = 0;
  }

  update(srcUp, srcDown, srcLeft, srcRight, srcHeart) {
    this.up.src = srcUp;
    this.down.src = srcDown;
    this.left.src = srcLeft;
    this.right.src = srcRight;
    this.heart.src = srcHeart;
  }

  newActual() {
    let filtered = this.options.filter((element) => {
      return element != this.actual;
    });
    this.actual = filtered[Math.floor(Math.random() * filtered.length)];
  }

  draw() {
    switch (this.actual) {
      case "ArrowUp":
        ctx.drawImage(
          arrow.up,
          canvas.width / 2 - this.drawSize,
          canvas.height / 2 - this.drawSize
        );
        break;
      case "ArrowDown":
        ctx.drawImage(
          arrow.down,
          canvas.width / 2 - this.drawSize,
          canvas.height / 2 - this.drawSize
        );
        break;
      case "ArrowLeft":
        ctx.drawImage(
          arrow.left,
          canvas.width / 2 - this.drawSize,
          canvas.height / 2 - this.drawSize
        );
        break;
      case "ArrowRight":
        ctx.drawImage(
          arrow.right,
          canvas.width / 2 - this.drawSize,
          canvas.height / 2 - this.drawSize
        );
        break;
      default:
        break;
    }
  }

  drawBackGround() {
    ctx.drawImage(arrow.up, canvas.width / 2 - this.drawSize, 0);
    ctx.drawImage(
      arrow.down,
      canvas.width / 2 - this.drawSize,
      canvas.height - this.drawSize * 2
    );
    ctx.drawImage(arrow.left, 0, canvas.height / 2 - this.drawSize);
    ctx.drawImage(
      arrow.right,
      canvas.width - this.drawSize * 2,
      canvas.height / 2 - this.drawSize
    );
  }

  isCorrect(str) {
    if (str == this.actual) {
      this.win = false;
      this.newActual();
      this.score++;
      this.playSoundEffect();
      if (!this.time) {
        this.time = Date.now();
      }
    } else if (this.time == 0) {
      return;
    } else {
      this.life--;
      this.playHurtEffect();
      if (this.life == 0) {
        this.gameOver();
      }
    }
  }

  gameOver() {
    this.score = 0;
    this.time = 0;
    this.life = 3;
    this.newActual();
  }

  drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "40px serif";
    ctx.fillText(`Score: ${this.score}`, 0, 40);
  }

  drawTime() {
    this.now = Date.now();
    ctx.fillStyle = "black";
    ctx.font = "40px serif";
    ctx.fillText(`Tempo: ${(this.now - this.time) / 1000}`, 0, canvas.height);
  }

  drawLifes() {
    for (let i = 0; i < this.life; i++) {
      ctx.drawImage(arrow.heart, i * 60, 80);
    }
  }

  playSoundEffect() {
    let audio = new Audio("./sound.wav");
    audio.addEventListener("ended", () => {
      audio = null;
    });
    audio.addEventListener("loadedmetadata", () => {
      audio.play();
    });
  }

  playHurtEffect() {
    let audio = new Audio("./hurt.mp3");
    audio.addEventListener("ended", () => {
      audio = null;
    });
    audio.addEventListener("loadedmetadata", () => {
      audio.play();
    });
  }

  finishGame() {
    const deltaTime = (this.now - this.time) / 1000;
    if (deltaTime >= 5) {
      this.win = true;
      this.lastScore = this.score;
      this.gameOver();
    }
    return;
  }

  drawWin() {
    ctx.fillStyle = "black";
    ctx.font = "20px serif";
    ctx.fillText(
      `Sua pontuação de ${this.lastScore} foi enviada!`,
      canvas.width / 6,
      canvas.height - 40
    );
    ctx.font = "12px serif";
    ctx.fillText(
      `Aperte a seta correspondente para jogar novamente :D`,
      canvas.width / 6,
      canvas.height - 10
    );
  }
}

const arrow = new Arrow(25);
arrow.update(
  "./cima.png",
  "./baixo.png",
  "./esquerda.png",
  "./direita.png",
  "./coracao.png"
);

arrow.newActual();

const clearScreen = () => {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
};

const handleKeyPress = (e) => {
  arrow.isCorrect(e.key);
};

const animate = () => {
  clearScreen();
  arrow.draw();
  arrow.drawScore();
  arrow.drawLifes();
  if (arrow.time) {
    arrow.drawTime();
    arrow.finishGame();
  }
  if (arrow.win) {
    arrow.drawWin();
  }
  requestAnimationFrame(animate);
};

animate();
window.addEventListener("keydown", handleKeyPress);
/*
QUANDO CHEGAR EM 30 SEGUNDOS TRAVAR O JOGO E DIZER QUE A PESSOA FINALIZOU O TESTE
 */
