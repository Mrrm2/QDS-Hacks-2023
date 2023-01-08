window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;

  const path = [
    { type: "flat", pathX: 300, pathY: 0 },
    { type: "decline", pathX: 300, pathY: 250 },
    { type: "flat", pathX: 300, pathY: 0 },
    { type: "decline", pathX: 300, pathY: 250 },
    { type: "flat", pathX: 300, pathY: 0 },
    { type: "flat", pathX: 300, pathY: 0 },
    { type: "incline", pathX: 300, pathY: -250 },
    { type: "flat", pathX: 300, pathY: 0 },
    { type: "incline", pathX: 300, pathY: -250 },
    { type: "flat", pathX: 3000, pathY: 0 },
  ];

  let globalDistance = -1; //groundX
  let globalAcceleration = 0;
  let globalGround = 100;
  let globalGrid = 0;
  let playerY = 100;

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
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 0;
      this.height = 0;
      this.x = 100;
      this.y = playerY;
      this.image = document.getElementById("truckImage");
      this.speed = 0;
    }
    draw(context) {
      this.y = playerY;
      // //flats
      // if (
      //   grid === 0 ||
      //   grid === 2 ||
      //   grid === 4 ||
      //   grid === 5 ||
      //   grid === 7 ||
      //   grid === 9
      // ) {
      // }

      // //decline
      // if (grid === 1 || grid === 3) {
      // }

      // //incline
      // if (grid === 6 || grid === 8) {
      // }

      context.beginPath();
      context.setLineDash([]);
      context.arc(this.x, this.y, 5, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();
    }
  }

  class Ground {
    constructor(gameWidth, gameHeight, globalDistance) {
      this.gameWidth = 1000;
      this.gameHeight = gameHeight;
      this.x = globalDistance;
      this.y = 100;
      this.speed = 0;
    }

    draw(context) {
      this.x = globalDistance;
      context.beginPath();
      context.moveTo(0, this.y);

      let totalPathX = 0;
      let totalPathY = 0;

      for (let i = 0; i < path.length; i++) {
        const currentPathX = path[i].pathX;
        const currentPathY = path[i].pathY;
        context.lineTo(
          this.x + totalPathX + currentPathX,
          this.y + totalPathY + currentPathY
        );
        totalPathX += currentPathX;
        totalPathY += currentPathY;
      }

      context.strokeStyle = "white";
      context.setLineDash([5, 5]);
      context.stroke();
    }

    update(input) {
      this.x -= this.speed;
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 1;
      } else {
        this.speed = 0;
      }
    }
  }

  function drive(input) {
    let playerX = globalDistance - 100;
    // console.log(playerX);

    globalDistance -= globalAcceleration;
    if (input.keys.indexOf("ArrowRight") > -1) {
      globalAcceleration = 1;
    } else {
      globalAcceleration = 0;
    }
    if (Math.abs(playerX) % 300 === 0) {
      globalGrid++;
    }
    //flats
    if (
      globalGrid === 0 ||
      globalGrid === 2 ||
      globalGrid === 4 ||
      globalGrid === 5 ||
      globalGrid === 7 ||
      globalGrid === 9
    ) {
    }

    //decline
    if (globalGrid === 1 || globalGrid === 3) {
      console.log((Math.abs(playerX) - 300))
      playerY = (250 / 300) * (Math.abs(playerX) - 300);
    }
    //incline
    if (globalGrid === 6 || globalGrid === 8) {
    }
    // console.log(playerY)
  }
  class Background {}

  function displayStatusText() {}

  const input = new InputHandler();
  const ground = new Ground(canvas.width, canvas.height, globalDistance);
  const player = new Player(canvas.width, canvas.height, ground.y, ground.x);
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    ground.draw(ctx);
    // ground.update(input);
    drive(input);
    requestAnimationFrame(animate);
  }
  animate();
});
