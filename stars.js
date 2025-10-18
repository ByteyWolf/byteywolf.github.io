var prevMouse = {x: 0, y: 0}, dX = 0, dY = 0, tDX = 0, tDY = 0, step = 0.5;
var colors = ["255,255,255", "255,200,200", "200,200,255"];
var canvas = document.getElementById('starCanvas'), ctx = canvas.getContext('2d');
var stars = [], numStars = 1000;

window.requestAnimationFrame = window.requestAnimationFrame || function(cb) {
    return window.setTimeout(cb, 16);
};

document.body.style.backgroundImage = "none";
canvas.width = window.innerWidth - 4;
canvas.height = window.innerHeight - 4;

document.onmousemove = function(e) {
    e = e || window.event;
    if (!prevMouse.x && !prevMouse.y) {
        prevMouse = {x: e.clientX, y: e.clientY};
        return;
    }
    tDX = e.clientX - prevMouse.x;
    tDY = e.clientY - prevMouse.y;
    prevMouse = {x: e.clientX, y: e.clientY};
};

function Star(x, y, r, o, fs, ss) {
    this.x = x; this.y = y; this.radius = r; this.opacity = o;
    this.fadeSpeed = fs; this.fadingIn = true; this.shootingStar = ss;
    this.color = colors[Math.floor(Math.random() * colors.length)];
}

function createStars() {
    for (var i = 0; i < numStars; i++) {
        var ss = Math.random() <= 0.01;
        stars.push(new Star(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 2 + 0.5,
            Math.random() / 2,
            Math.random() * 0.005 + 0.005,
            ss
        ));
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.opacity += s.fadingIn ? s.fadeSpeed : -s.fadeSpeed;
        if (s.opacity >= 1) s.fadingIn = false;
        if (s.opacity <= 0) {
            s.fadingIn = true;
            s.x = Math.random() * canvas.width;
            s.y = Math.random() * canvas.height;
        }
        s.x = (s.x - dX / 10 + (s.shootingStar ? 5 : 0)) % canvas.width;
        s.y = (s.y - dY / 10 + (s.shootingStar ? 2 : 0)) % canvas.height;
        ctx.fillStyle = "rgba(" + s.color + "," + s.opacity + ")";
        ctx.fillRect(s.x, s.y, s.radius, s.radius);
    }
    requestAnimationFrame(drawStars);
}

function approach(v, t, st) {
    return Math.abs(v - t) <= st ? t : v + (t > v ? st : -st);
}

function updateDeltas() {
    tDX = approach(tDX, 0, step / 2);
    tDY = approach(tDY, 0, step / 2);
    dX = approach(dX, tDX, step);
    dY = approach(dY, tDY, step);
    requestAnimationFrame(updateDeltas);
}

window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    createStars();
};

createStars();
drawStars();
updateDeltas();