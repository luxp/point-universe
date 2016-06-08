let sweetName = '';
let sweetText = [];
let sweetPointNum = 100;

let canPlay;
let sweetWordElm = document.getElementById('sweetWord');
let sweetNameElm = document.getElementById('sweetName');

let main = (p5) => {
  let pointNum = sweetPointNum;
  let pointCollection = [];
  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;
  let lightStarNum = 2;
  let focusedPointIndex = 0;
  let focusedPoint = null;
  let focusedPointSize = Math.min(canvasHeight, canvasWidth) / 8;
  let shortestDistance = canvasWidth;

  let initPoint = () => {
    for (let i = 0; i < pointNum; ++i) {
      pointCollection[i] = {
        position: {
          x: canvasWidth * Math.random(),
          y: canvasHeight / 2,
          toX: canvasWidth * Math.random(),
          toY: canvasHeight / 2,
          speedAngle: Math.PI * 2 * Math.random(),
          speedX: 0,
          speedY: 0
        },
        shape: {
          size: 0,
          toSize: 10 * Math.random()
        },
        color: {
          r: 0,
          g: 0,
          b: 0,
          toR: 225 * Math.random(),
          toG: 225 * Math.random(),
          toB: 225 * Math.random()
        },
        seek: {
          distance: 0,
          speed: 0
        },
        focused: false
      };

      pointCollection[i].toX = pointCollection[i].x;
    }
  };
  initPoint();

  let lightUpStar = () => {
    for (let i = 0; i < lightStarNum; ++i) {
      let point = pointCollection[Math.floor(Math.random() * pointNum)];
      if (!point.focused) {
        point.shape.size = Math.random() * 30;
      }
    }
  };

  let randomPosition = () => {
    for (let i = 0; i < pointNum; ++i) {
      let point = pointCollection[i];
      if (!point.focused) {
        point.position.toX = Math.random() * canvasWidth;
        point.position.toY = Math.random() * canvasHeight;
        point.position.speedX = Math.cos(point.position.speedAngle) * Math.random() / 3;
        point.position.speedY = Math.sin(point.position.speedAngle) * Math.random() / 3;
      }
    }
  };

  let randomSize = () => {
    for (let i = 0; i < pointNum; ++i) {
      let point = pointCollection[i];
      if (!point.focused) {
        pointCollection[i].shape.toSize = Math.random() * 10 + 1;
      }
    }
  };

  let randomColor = () => {
    for (let i = 0; i < pointNum; ++i) {
      let point = pointCollection[i];
      if (!point.focused) {
        point.color.toR = Math.random() * 255;
        point.color.toG = Math.random() * 255;
        point.color.toB = Math.random() * 255;
      }
    }
  };

  // white flash
  let whiteFlash = () => {
    randomPosition();
    for (let i = 0; i < pointNum; ++i) {
      let point = pointCollection[i];
      if (!point.focused) {
        point.color.r = 255;
        point.color.g = 255;
        point.color.b = 255;
        point.shape.size = Math.random() * 50 + 50;
      }
    }
  };


  let drawCircleAngle = Math.PI / 180 * (360 / pointNum);
  let maxCircleRadius = Math.min(canvasHeight, canvasWidth) / 2;
  let minCircleRadius = 80;
  let drawCircle = (radius) => {
    radius = radius || (maxCircleRadius - minCircleRadius) * Math.random() + minCircleRadius;
    let circleCenter = {
      x: radius + (canvasWidth - 2 * radius) * Math.random(),
      y: radius + (canvasHeight - 2 * radius) * Math.random()
    };
    for (let i = 0; i < pointNum; ++i) {
      let point = pointCollection[i];
      if (!point.focused) {
        point.shape.toSize = 5 * Math.random() + 1;
        point.position.toX = Math.cos(drawCircleAngle * i) * radius + circleCenter.x;
        point.position.toY = Math.sin(drawCircleAngle * i) * radius + circleCenter.y;
      }
    }
  };

  let maxHeartSize = 18;
  let minHeartSize = 7;
  if (Math.min(canvasHeight, canvasWidth) < 500) {
    minHeartSize = 3;
    maxHeartSize = 5;
  }
  let step = 2 * Math.PI / pointNum;
  let drawHeart = () => {
    let size = minHeartSize + maxHeartSize * Math.random();
    let maxX = 0;
    let maxY = 0;
    let minY = 0;
    let minX = 0;
    for (let i = 0; i < pointNum; ++i) {
      let point = pointCollection[i];
      if (!point.focused) {
        point.shape.toSize = 4 * Math.random() + 1;
        let cos = Math.cos;
        let sin = Math.sin;
        let t = step * i;
        let x = 16 * Math.pow(sin(t), 3) * size;
        let y = (13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t)) * -size;
        point.position.toX = x;
        point.position.toY = y;
        if (x > maxX) {
          maxX = x;
        }
        if (x < minX) {
          minX = x;
        }
        if (y > maxY) {
          maxY = y;
        }
        if (y < minY) {
          minY = y;
        }
      }
    }

    let center = {
      x: -minX + (canvasWidth - (maxX - minX)) * Math.random(),
      y: -minY + (canvasHeight - (maxY - minY)) * Math.random()
    };

    for (let i = 0; i < pointNum; ++i) {
      let point = pointCollection[i];
      if (!point.focused) {
        point.position.toX += center.x;
        point.position.toY += center.y;
      }
    }
  };

  let maxSize = Math.min(canvasHeight, canvasWidth) / 2;
  let drawPolygon = (n, size, vertexStep) => {
    vertexStep = vertexStep || 2;
    n = n || Math.floor(Math.random() * 6) + 3;
    size = (maxSize - 100) * Math.random() + 100;

    let vertexCollection = [];
    let anglePlus = Math.PI * 2 / n;
    let eachLineNum = Math.floor(pointNum / n);

    let vertexXPlus = size + (canvasWidth - 2 * size) * Math.random();
    let vertexYPlus = size + (canvasHeight - 2 * size) * Math.random();
    for (let i = 0; i < n; ++i) {
      vertexCollection[i] = {
        x: Math.cos(anglePlus * i) * size + vertexXPlus,
        y: Math.sin(anglePlus * i) * size + vertexYPlus
      }
    }

    let pointIndex = 0;
    for (let i = 0; i < n; ++i) {
      let vertex1 = vertexCollection[i % n];
      let vertex2 = vertexCollection[(i + vertexStep) % n];
      let xPlus = (vertex1.x - vertex2.x) / eachLineNum;
      let yPlus = (vertex1.y - vertex2.y) / eachLineNum;
      for (let j = 0; j < eachLineNum; ++j) {
        let point = pointCollection[pointIndex++];
        if (!point.focused) {
          point.position.toX = vertex1.x - xPlus * j;
          point.position.toY = vertex1.y - yPlus * j;
        }
      }
    }
  };

  let transformCollection = [
    randomPosition,
    drawCircle,
    randomSize,
    randomColor,
    drawHeart,
    drawPolygon,
    drawPolygon,
    whiteFlash,
    drawPolygon,
    drawPolygon,
    whiteFlash,
    whiteFlash
  ];
  let transformNum = transformCollection.length;

  let autoTransform = () => {
    if (canPlay) {
      document.getElementById('inLoveAudio').play();
      setTimeout(drawHeart, 1000);
      setTimeout(() => {
        autoTransform = () => {
          drawHeart();
          transformCollection[Math.floor(Math.random() * transformNum)]();
          setTimeout(autoTransform, 1000 + (Math.random() * 1000));
        };
      }, 2000);
    }
    setTimeout(autoTransform, 1000);
  };

  autoTransform();


  let seekMouse = (point, mx, my) => {
    if (!point.focus) {
      let toX = point.position.toX;
      let toY = point.position.toY;
      let dx = toX - mx;
      let dy = toY - my;
      let distance = p5.dist(mx, my, toX, toY);

      if (distance < 100) {
        let startDegree = Math.atan2(dy, dx);
        if (point.seek.distance) {
          point.seek.distance += (distance - point.seek.distance) / 200;
          point.seek.speed += Math.random() * 0.0001;
        } else {
          point.seek.distance = distance;
          point.seek.speed = 0;
        }
        let angle = startDegree - Math.PI / 60000 + point.seek.speed;
        point.position.toX = mx + Math.cos(angle) * point.seek.distance;
        point.position.toY = my + Math.sin(angle) * point.seek.distance;
      } else {
        point.seek.distance = 0;
      }

    }
  };

  let update = () => {
    shortestDistance = canvasWidth;
    focusedPointIndex = 0;
    for (let i = 0; i < pointNum; ++i) {
      var point = pointCollection[i];
      point.position.x = point.position.x - (point.position.x - point.position.toX) / 10;
      point.position.y = point.position.y - (point.position.y - point.position.toY) / 10;

      point.shape.size = point.shape.size - (point.shape.size - point.shape.toSize) / 10;

      point.color.r = point.color.r - (point.color.r - point.color.toR) / 10;
      point.color.g = point.color.g - (point.color.g - point.color.toG) / 10;
      point.color.b = point.color.b - (point.color.b - point.color.toB) / 10;

      if (!point.focused) {
        point.position.toX += point.position.speedX;
        point.position.toY += point.position.speedY;

        if (point.position.x >= canvasWidth) {
          point.position.toX = canvasWidth - 20 * Math.random();
        } else if (point.position.x <= 0) {
          point.position.toX = 10 * Math.random();
        }

        if (point.position.y >= canvasHeight) {
          point.position.toY = canvasHeight - 20 * Math.random();
        } else if (point.position.y <= 0) {
          point.position.toY = 10 * Math.random();
        }

        let mx = p5.mouseX;
        let my = p5.mouseY;
        seekMouse(point, mx, my);

        let dist = p5.dist(point.position.x, point.position.y, mx, my);
        if (shortestDistance > dist) {
          focusedPointIndex = i;
          shortestDistance = dist;
        }
      }
    }

    lightUpStar();
  };

  p5.setup = () => {
    p5.createCanvas(canvasWidth, canvasHeight);
    p5.background(0);
    p5.frameRate(60);
    document.getElementById('inLoveAudio').src = 'in-love.mp3';
  };

  p5.draw = () => {
    p5.background(0);
    update();
    for (let i = 0; i < pointNum; ++i) {
      let point = pointCollection[i];
      p5.stroke(point.color.r, point.color.g, point.color.b);
      p5.strokeWeight(point.shape.size);
      p5.point(point.position.x, point.position.y);
    }
    lightUpStar();
  };

  p5.mousePressed = () => {
    if (sweetText.length) {
      if (focusedPoint) {
        focusedPoint.focused = false;
        focusedPoint.shape.toSize = 4 * Math.random() + 1;
        focusedPoint.position.toX = canvasWidth * Math.random();
        focusedPoint.position.toY = canvasHeight * Math.random();
      }
      if (shortestDistance < 100) {
        let sweet = sweetText[Math.floor(sweetText.length * Math.random())];
        sweetWordElm.innerHTML = sweet[0];
        sweetNameElm.innerHTML = sweet[1] || sweetName;
        focusedPoint = pointCollection[focusedPointIndex];
        focusedPoint.focused = true;
        focusedPoint.shape.toSize = focusedPointSize;
        focusedPoint.position.toX = canvasWidth * 0.2 - focusedPointSize / 2;
        focusedPoint.position.toY = canvasHeight * 0.5;

        sweetNameElm.style.color = 'rgb(' + Math.floor(focusedPoint.color.r) + ',' + Math.floor(focusedPoint.color.g) + ',' + Math.floor(focusedPoint.color.b) + ')';
      } else {
        sweetWordElm.innerHTML = '';
        sweetNameElm.innerHTML = '';
      }
    }
  };
};

new p5(main, 'main');

let playAudio = () => {
  if (sweetText.length) {
    sweetWordElm.innerHTML = sweetText[0][0];
    sweetNameElm.innerHTML = sweetName;
  }
  sweetNameElm.innerHTML = '';
  sweetWordElm.innerHTML = '';
  canPlay = true;
};
