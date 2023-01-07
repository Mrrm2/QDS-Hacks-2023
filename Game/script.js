window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;

  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowRight" || e.key === "ArrowLeft") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight, groundHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 222;
      this.height = 120;
      this.x = 10;
      this.y = groundHeight - this.height;
      this.image = document.getElementById("truckImage");
      this.speed = 0;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    // update(input) {
    //   this.x += this.speed;
    //   if (input.keys.indexOf("ArrowRight") > -1) {
    //     this.speed = 1;
    //   } else {
    //     this.speed = 0;
    //   }
    // }
  }

  class Ground {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.x = 0;
      this.y = 600;
      this.speed = 0;
    }

    draw(context) {
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(this.gameWidth, this.y);
      context.strokeStyle = "white";
      context.setLineDash([5, 15]);
      context.stroke();
    }

    // draw(context) {
    //   context.drawImage(this.image, this.x, this.y, this.width, this.height);
    // }
    update(input) {
      this.x -= this.speed;
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 1;
      } else {
        this.speed = 0;
      }
      console.log(this.x)
    }
  }

  class Background {}

  function displayStatusText() {}

  const input = new InputHandler();
  const ground = new Ground(canvas.width, canvas.height);
  const player = new Player(canvas.width, canvas.height, ground.y);
  console.log(player.y);
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    ground.draw(ctx);
    ground.update(input);
    requestAnimationFrame(animate);
  }
  animate();
});
