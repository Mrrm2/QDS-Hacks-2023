window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;

  const DECLINE = {
    terrain: "decline",
    pathX: 300,
    pathY: 250,
    accelerationRate: 0.2,
    decelerationRate: -0.01,
    maxSpeed: 4,
  };

  const FLAT = {
    terrain: "flat",
    pathX: 300,
    pathY: 0,
    accelerationRate: 0.05,
    decelerationRate: -0.05,
    maxSpeed: 3,
  };

  const INCLINE = {
    terrain: "incline",
    pathX: 300,
    pathY: -250,
    accelerationRate: 0.01,
    decelerationRate: -0.2,
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
  ];

  let distanceTravelled = 0; //groundX
  // console.log("segment", segment)
  let gameLeg = Math.floor(distanceTravelled / 1500);
  let playerY = 100;
  let segment = Math.floor(distanceTravelled / 300);
  let currTerrain = path[segment];
  let timer = 0
  console.log("segment", segment);

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
      if (segment === 1) {
        playerY = (250 / 300) * (Math.abs(this.x)) + 100;
      }
      console.log(this.y)
      this.y = playerY;
      context.beginPath();
      context.setLineDash([]);
      context.arc(this.x, this.y, 5, 0, 2 * Math.PI);
      context.fillStyle = "red";
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
      // update max_speed based to make it more realistic (max speed of the truck in data was 60km/h for a 6km course)
      // this.max_speed = 3;
    }
    acceleration(input) {
      let map = {
        accel: currTerrain.accelerationRate,
        decel: currTerrain.decelerationRate,
        maxSpeed: currTerrain.maxSpeed,
      };
      // console.log(currTerrain.terrain)

      // if you are able to accelerate
      if (input === true) {
        // console.log("true");
        // determine the acceleration factor using the terrain
        this.speed = Math.min(this.speed + map.accel, map.maxSpeed);
      } else if (input === false) {
        this.speed = Math.max(0, this.speed + map.decel);
        // this.speed = 0
        // console.log(this.speed);
      }
    }

    draw(context) {
      // this.x = distanceTravelled;
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
      distanceTravelled += this.speed;
      segment = Math.floor((distanceTravelled + 100) / 300);
      console.log(segment);
      currTerrain = path[segment];
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.acceleration(true);
        // this.speed = 2;
      } else {
        this.acceleration(false);
        // this.speed = 0;
      }
      // console.log(this.y);
    }
  }

  // function drive(input) {
  //   let playerX = distanceTravelled - 100;
  //   // console.log(playerX);

  //   distanceTravelled -= globalAcceleration;
  //   if (input.keys.indexOf("ArrowRight") > -1) {
  //     globalAcceleration = 1;
  //   } else {
  //     globalAcceleration = 0;
  //   }
  //   if (Math.abs(playerX) % 300 === 0) {
  //     globalGrid++;
  //   }
  //   //flats
  //   if (
  //     globalGrid === 0 ||
  //     globalGrid === 2 ||
  //     globalGrid === 4 ||
  //     globalGrid === 5 ||
  //     globalGrid === 7 ||
  //     globalGrid === 9
  //   ) {
  //   }

  //   //decline
  //   if (globalGrid === 1) {
  //     console.log((Math.abs(playerX) - 300))
  //     playerY = (250 / 300) * (Math.abs(playerX) - 300) + 100;
  //   }

  //   if (globalGrid === 3){
  //     playerY = (250 / 300) * (Math.abs(playerX) - 600) + 100;
  //   }
  //   //incline
  //   if (globalGrid === 6) {
  //     playerY = Math.abs(-250 / 300) * (Math.abs(playerX)) + 100;
  //   }

  //   if(globalGrid === 8) {
  //     playerY = (-250 / 300) * (Math.abs(playerX) + 0);

  //   }
  //   console.log(playerY)
  // }
  class Background {}

  function displayStatusText() {}

  const input = new InputHandler();
  const ground = new Ground(canvas.width, canvas.height, distanceTravelled);
  const player = new Player(canvas.width, canvas.height, ground.y, ground.x);
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    ground.draw(ctx);
    ground.update(input);
    timer += 0.016666
    console.log(timer)
    // drive(input);
    requestAnimationFrame(animate);
  }
  animate();
});
