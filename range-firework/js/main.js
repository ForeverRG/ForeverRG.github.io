javascript: !(function () {
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
      if (canvas.width) var gap = 6;
      var fontSize = 120;

      if (canvas.width >= 1200) {
        // PC端
        fontSize = 120;
      } else if (canvas.width >= 960 && canvas.width <= 1199) {
        // PC端
        fontSize = 110;
      } else if (canvas.width >= 768 && canvas.width <= 959) {
        // PC端
        fontSize = 100;
      } else if (canvas.width >= 640 && canvas.width <= 767) {
        // 平板端或者手机横屏
        fontSize = 90;
      } else if (canvas.width >= 480 && canvas.width <= 639) {
        // 手机横屏
        fontSize = 80;
        gap = 5;
      } else if (canvas.width >= 320 && canvas.width <= 479) {
        // 手机竖屏
        fontSize = 70;
        gap = 4;
      } else if (canvas.width >= 240 && canvas.width <= 319) {
        // 手机竖屏
        fontSize = 60;
        gap = 4;
      } else if (canvas.width <= 239) {
        // 手机竖屏
        fontSize = 50;
        gap = 4;
      }

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

  var lastStamp = 0;
  var textIndex = 0;
  // 定时循环事件
  function tick(opt = 0) {
    if (opt - lastStamp > 3000) {
      lastStamp = opt;
      createFireworks(
        Math.random() * canvas.width,
        Math.random() * 0.5 * canvas.height,
        [
          "❤呆呆❤",
          "新年快乐",
          "Daisy",
          "Happy",
          "Everyday",
          "代玉",
          "烦恼退散",
        ][textIndex]
      );
      if (textIndex++ >= 6) {
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

  // var isShowTextCanvas = false;
  // 双击事件
  // var tCanvas = document.getElementById("text-canvas");
  // tCanvas.ondblclick = function () {
  //   // isShowTextCanvas = !isShowTextCanvas;
  //   // if (!isShowTextCanvas) {
  //   //   stopAnimation();
  //   //   return;
  //   // }
  //   console.log("触发双击");
  //   tick();
  // };

  // 连续点击事件
  var timer = null;
  var waitTime = 200; // 该时间间隔内点击才算连续点击（单位：ms）
  var lastTime = new Date().getTime(); // 上次点击时间
  var count = 0; // 连续点击次数
  var canvasesDiv = document.getElementById("canvases");
  // 获取对象
  canvasesDiv.onclick = function (event) {
    var currentTime = new Date().getTime();
    // 计算两次相连的点击时间间隔
    count = currentTime - lastTime < waitTime ? count + 1 : 1;
    lastTime = new Date().getTime();
    clearTimeout(timer);
    timer = setTimeout(function () {
      clearTimeout(timer);
      // console.log(count);
      // 双击
      if (count === 2) {
        tick();
      }
      // 三击
      if (count > 2) {
        var controlBtn = document.getElementById("control-btn");
        controlBtn.style.display = "flex";
      }
    }, waitTime + 10);
  };
})();
