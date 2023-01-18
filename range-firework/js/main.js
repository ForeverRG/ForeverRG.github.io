// javascript: !(function () {
var isDebug = false;
var textCanvas = document.createElement("canvas");
textCanvas.width = 1000;
textCanvas.height = 300;
if (isDebug) {
  textCanvas.style.position = "absolute";
  textCanvas.style.zIndex = "9999";
  document.body.appendChild(textCanvas);
}
var textctx = textCanvas.getContext("2d");
textctx.fillStyle = "#000000";
textctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

var canvas = document.createElement("canvas");
document.getElementById("canvases").appendChild(canvas);

canvas.setAttribute("id", "text-canvas");
canvas.style.position = "fixed";
canvas.style.left = "0";
canvas.style.top = "0";

var context = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  clearCanvas();
}

function clearCanvas() {
  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// function mouseDownHandler(e) {
//   var x = e.clientX;
//   var y = e.clientY;

//   createFireworks(
//     x,
//     y
//     // ["Test1", "Test2", "Test3", "Test4", "Test5", "Test6"][
//     //   Math.floor(Math.random() * 6)
//     // ]
//   );
// }
// document.addEventListener("mousedown", mouseDownHandler);

var particles = [];

function createFireworks(x, y, text = "") {
  var hue = Math.random() * 360;
  var hueVariance = 30;

  function setupColors(p) {
    p.hue =
      Math.floor(Math.random() * (hue + hueVariance - (hue - hueVariance))) +
      (hue - hueVariance);
    p.brightness = Math.floor(Math.random() * 21) + 50;
    p.alpha = (Math.floor(Math.random() * 61) + 40) / 100;
  }

  if (text != "") {
    var gap = 6;
    var fontSize = 120;

    textctx.font = fontSize + "px _sans";
    textctx.fillStyle = "#ffffff";

    var textWidth = Math.ceil(textctx.measureText(text).width);
    var textHeight = Math.ceil(fontSize * 1.2);

    textctx.fillText(text, 0, fontSize);
    var imgData = textctx.getImageData(0, 0, textWidth, textHeight);

    if (isDebug) context.putImageData(imgData, 400, 300);

    textctx.fillStyle = "#000000";
    textctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

    for (var h = 0; h < textHeight; h += gap) {
      for (var w = 0; w < textWidth; w += gap) {
        var position = (textWidth * h + w) * 4;
        var r = imgData.data[position],
          g = imgData.data[position + 1],
          b = imgData.data[position + 2],
          a = imgData.data[position + 3];

        if (r + g + b == 0) continue;

        var p = {};

        p.x = x;
        p.y = y;

        p.fx = x + w - textWidth / 2;
        p.fy = y + h - textHeight / 2;

        p.size = Math.floor(Math.random() * 2) + 1;
        p.speed = 1;

        setupColors(p);

        particles.push(p);
      }
    }
  } else {
    var count = 100;
    for (var i = 0; i < count; i++) {
      //角度
      var angle = (360 / count) * i;
      //弧度
      var radians = (angle * Math.PI) / 180;

      var p = {};

      p.x = x;
      p.y = y;
      p.radians = radians;

      //大小
      p.size = Math.random() * 2 + 1;

      //速度
      p.speed = Math.random() * 5 + 0.4;

      //半径
      p.radius = Math.random() * 81 + 50;

      p.fx = x + Math.cos(radians) * p.radius;
      p.fy = y + Math.sin(radians) * p.radius;

      setupColors(p);

      particles.push(p);
    }
  }
}

function drawFireworks() {
  clearCanvas();

  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];

    p.x += (p.fx - p.x) / 10;
    p.y += (p.fy - p.y) / 10 - (p.alpha - 1) * p.speed;

    p.alpha -= 0.006;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    context.beginPath();
    context.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
    context.closePath();

    context.fillStyle =
      "hsla(" + p.hue + ",100%," + p.brightness + "%," + p.alpha + ")";
    context.fill();
  }
}

//requestAnimationFrame
var lastStamp = 0;
var textIndex = 0;
var isShowTextCanvas = false;

// 定时循环事件
function tick(opt = 0) {
  if (opt - lastStamp > 2000) {
    lastStamp = opt;
    createFireworks(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      [
        "Daisy",
        "Happy",
        "Everyday",
        "呆呆",
        "Happy",
        "New Year",
        "代玉",
        "永远开心",
      ][textIndex]
    );
    if (textIndex++ >= 7) {
      textIndex = 0;
    }
  }
  context.globalCompositeOperation = "destination-out";
  context.fillStyle = "rgba(0,0,0," + 10 / 100 + ")";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = "lighter";
  drawFireworks();

  startAnimation(tick);
}

var requestId;
function startAnimation(myAnimate) {
  requestId = requestAnimationFrame(myAnimate);
}

function stopAnimation() {
  if (requestId) cancelAnimationFrame(requestId);
  requestId = 0;
}

// 双击事件
var tCanvas = document.getElementById("text-canvas");
tCanvas.ondblclick = function () {
  // isShowTextCanvas = !isShowTextCanvas;
  // if (!isShowTextCanvas) {
  //   stopAnimation();
  //   return;
  // }
  tick();
};

// 连续点击事件
var timer = null;
var waitTime = 200; // 该时间间隔内点击才算连续点击（单位：ms）
var lastTime = new Date().getTime(); // 上次点击时间
var count = 0; // 连续点击次数
// 获取对象
var heartCanvas = document.getElementById("heart-canvas");
tCanvas.onclick = function (event) {
  var currentTime = new Date().getTime();
  // 计算两次相连的点击时间间隔
  count = currentTime - lastTime < waitTime ? count + 1 : 1;
  lastTime = new Date().getTime();
  clearTimeout(timer);
  timer = setTimeout(function () {
    clearTimeout(timer);
    // 处理点击事件
    console.log(count);
    if (count > 4) {
      // 连续点击五次
      console.log("点击超过4次了");
      draw();
    }
  }, waitTime + 10);
};
// })();
