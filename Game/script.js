window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  const SCALE = 0.85;
  canvas.width = 800 * SCALE;
  canvas.height = 650;
  let truckSpeed = 0;

  const gameEnd = () => {
    console.log("gameEnd")
  };

  const img = new Image();
  img.src = "dirt.png";

  const DECLINE = {
    terrain: "decline",
    pathX: 300,
    pathY: 250,
    accelerationRate: 0.01,
    decelerationRate: -0.0075,
    maxSpeed: 4,
  };

  const FLAT = {
    terrain: "flat",
    pathX: 300,
    pathY: 0,
    accelerationRate: 0.025,
    decelerationRate: -0.025,
    maxSpeed: 3,
  };

  const INCLINE = {
    terrain: "incline",
    pathX: 300,
    pathY: -250,
    accelerationRate: 0.0075,
    decelerationRate: -0.0275,
    maxSpeed: 2,
  };

  const path = [
    FLAT,
    DECLINE,
    FLAT,
    DECLINE,
    FLAT,
    FLAT,
    INCLINE,
    FLAT,
    INCLINE,
    FLAT,
    FLAT,
  ];

  let distanceTravelled = 0;
  let gameLeg = Math.floor(distanceTravelled / 1500);
  let playerY = 100;
  let segment = Math.floor(distanceTravelled / 300);
  let currTerrain = path[segment];
  let timer = 0;

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
      this.x_relative = 100;
      this.image = document.getElementById("truckImage");
      this.speed = 0;
    }
    draw(context) {
      // console.log(distanceTravelled)
      if (Math.ceil(distanceTravelled) > 2900) {
        this.image = document.getElementById("truckImageFlat");
        context.drawImage(
          this.image,
          this.x_relative - 40,
          this.y - 53,
          70,
          70
        );
        gameEnd();
        return;
      }
      let slope = currTerrain.pathY / currTerrain.pathX;
      let x = distanceTravelled + this.x_relative;
      let intercept = segment * 100;
      let offset = 100;
      switch (segment) {
        case 0:
          intercept = 0;
          break;
        case 1:
          intercept = -250;
          break;
        case 2:
          intercept = 250;
          break;
        case 3:
          intercept = -500;
          break;
        case 4:
          intercept = 500;
          break;
        case 5:
          intercept = 500;
          break;
        case 6:
          intercept = 2000;
          break;
        case 7:
          intercept = 250;
          break;
        case 8:
          intercept = 2250;
          break;
        case 9:
          intercept = 0;
          break;
      }
      playerY = slope * x + intercept + offset;

      this.y = playerY;
      context.beginPath();
      context.setLineDash([]);

      if (currTerrain.terrain === "decline") {
        this.image = document.getElementById("truckImageDecline");
        context.drawImage(
          this.image,
          this.x_relative - 27,
          this.y - 53,
          70,
          70
        );
      } else if (currTerrain.terrain === "flat") {
        this.image = document.getElementById("truckImageFlat");
        context.drawImage(
          this.image,
          this.x_relative - 40,
          this.y - 53,
          70,
          70
        );
      } else if (currTerrain.terrain === "incline") {
        this.image = document.getElementById("truckImageIncline");
        context.drawImage(
          this.image,
          this.x_relative - 42,
          this.y - 53,
          70,
          70
        );
      }
      context.fill();
    }
  }

  class Ground {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.x = 0;
      this.y = 100;
      this.speed = 0;
      this.counter = 0;
    }
    acceleration(input) {
      let map = {
        accel: currTerrain.accelerationRate,
        decel: currTerrain.decelerationRate,
        maxSpeed: currTerrain.maxSpeed,
      };
      if (input === true) {
        if (this.speed + map.accel > map.maxSpeed) {
          this.speed -= map.accel;
        } else {
          this.speed = Math.min(this.speed + map.accel, map.maxSpeed);
        }
      } else if (input === false) {
        this.speed = Math.max(0, this.speed + map.decel);
      }
    }

    draw(context) {
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

      context.lineTo(this.x + totalPathX + 1000, this.y + totalPathY);
      context.lineTo(this.x + totalPathX + 1000, canvas.height);
      context.lineTo(0, canvas.height);
      context.lineWidth = 3;
      context.strokeStyle = "rgb(128, 83, 28)";
      context.stroke();
      context.closePath();
      context.save();
      context.transform(1, 0, 0, 1, this.x, 0);
      const pattern = context.createPattern(img, "repeat");
      context.fillStyle = pattern;
      context.fill();
      context.restore();
    }

    update(input) {
      this.x -= this.speed;
      this.counter++;
      truckSpeed = this.speed;

      let km = Math.trunc(truckSpeed * 12.5);

      if (this.counter === 6) {
        document.getElementById("kmhInput").innerHTML = km;
        this.counter = 0;
      }

      let distanceLeft = Math.trunc(2900 - distanceTravelled);
      if (distanceLeft <= 1450)
        document.getElementById("statusMessage").innerHTML = "hauling";

      if (distanceLeft <= 0) {
        document.getElementById("distance").innerHTML = "DUMP COMPLETE!";
        document.getElementById("statusMessage").innerHTML = "dumped";
      }

      if (distanceLeft % 2 === 0 && distanceLeft !== null) {
        document.getElementById("distanceInput").innerHTML = distanceLeft;
      }

      distanceTravelled += this.speed;

      const fpBar = document.getElementById("fpBar");

      fpBar.style.width = distanceTravelled / 50 + "%";

      if (Number(fpBar.style.width.slice(0, -1)) > 20) {
        fpBar.style.backgroundColor = "red";
      }

      segment = Math.floor((distanceTravelled + 100) / 300);
      currTerrain = path[segment];
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.acceleration(true);
      } else {
        this.acceleration(false);
      }
    }
  }

  const backgroundLayer1 = new Image();
  backgroundLayer1.src = "sky.png";
  const backgroundLayer2 = new Image();
  backgroundLayer2.src = "far-clouds.png";
  const backgroundLayer3 = new Image();
  backgroundLayer3.src = "near-clouds.png";
  const backgroundLayer4 = new Image();
  backgroundLayer4.src = "far-mountains.png";
  const backgroundLayer5 = new Image();
  backgroundLayer5.src = "mountains.png";
  const backgroundLayer6 = new Image();
  backgroundLayer6.src = "trees.png";

  class Layer {
    constructor(image, speedModifier) {
      this.x = 0;
      this.y = 0;
      this.width = 850;
      this.height = 650;
      this.x2 = this.width;
      this.image = image;
      this.speedModifier = speedModifier;
      this.speed = truckSpeed * this.speedModifier;
    }
    update() {
      this.speed = truckSpeed * this.speedModifier;
      if (this.x <= -this.width) {
        this.x = this.width + this.x2 - this.speed;
      }
      if (this.x2 <= -this.width) {
        this.x2 = this.width + this.x - this.speed;
      }
      this.x = Math.floor(this.x - this.speed);
      this.x2 = Math.floor(this.x2 - this.speed);
    }
    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
  }

  const layer1 = new Layer(backgroundLayer1, 0);
  const layer2 = new Layer(backgroundLayer2, 0.3);
  const layer3 = new Layer(backgroundLayer3, 0.5);
  const layer4 = new Layer(backgroundLayer4, 0.1);
  const layer5 = new Layer(backgroundLayer5, 0.3);
  const layer6 = new Layer(backgroundLayer6, 1.5);

  const gameObjects = [layer1, layer2, layer3, layer4, layer5, layer6];

  const input = new InputHandler();
  const ground = new Ground(canvas.width, canvas.height, distanceTravelled);
  const player = new Player(canvas.width, canvas.height, ground.y, ground.x);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameObjects.forEach((object) => {
      object.update();
      object.draw();
    });
    player.draw(ctx);
    ground.draw(ctx);
    ground.update(input);
    requestAnimationFrame(animate);
  }
  animate();
});
