let previousMousePosition = { x: 0, y: 0 };
let deltaX = 0
let deltaY = 0
let targetDeltaX = 0
let targetDeltaY = 0
const step = 0.5;

const colorOptions = [
    "255, 255, 255", // white
    "255, 200, 200",     // red
    "200, 200, 255"      // blue
];
document.addEventListener('mousemove', (event) => {
    if (previousMousePosition.x === 0 && previousMousePosition.y === 0) {
        previousMousePosition = { x: event.clientX, y: event.clientY };
        return;
    }
    targetDeltaX = event.clientX - previousMousePosition.x;
    targetDeltaY = event.clientY - previousMousePosition.y;
    previousMousePosition = { x: event.clientX, y: event.clientY };
});


// sloppily assembled with lots of guessing and chatgpt
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
document.body.style.backgroundImage = "none";

canvas.width = window.innerWidth-4;
canvas.height = window.innerHeight-4;

const stars = [];
const numStars = 1000;

function Star(x, y, radius, opacity, fadeSpeed, shootingStar) {
this.x = x;
this.y = y;
this.radius = radius;
this.opacity = opacity;
this.fadeSpeed = fadeSpeed;
this.fadingIn = true;
this.shootingStar = shootingStar;

this.colorTemplate = colorOptions[Math.floor(Math.random() * colorOptions.length)];
}

function createStars() {
for (let i = 0; i < numStars; i++) {
    let shootingStar = false;
    if (Math.random() <= 0.01) {
        shootingStar = true;
    }
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 2 + 0.5;
    const opacity = Math.random() / 2;
    const fadeSpeed = Math.random() * 0.005 + 0.005;
    stars.push(new Star(x, y, radius, opacity, fadeSpeed, shootingStar));
}
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        if (star.fadingIn) {
        star.opacity += star.fadeSpeed;
        if (star.opacity >= 1) star.fadingIn = false;
        } else {
        star.opacity -= star.fadeSpeed;
        if (star.opacity <= 0) {
            star.fadingIn = true;
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
        }
        
        }
        star.x -= deltaX / 10;
        star.y -= deltaY / 10;
        if (star.shootingStar) {
            star.x += 5;
            star.y += 2;
        }
        star.x = star.x % canvas.width;
        star.y = star.y % canvas.height;
        ctx.fillStyle = `rgba(${star.colorTemplate}, ${star.opacity})`;
        ctx.fillRect(star.x, star.y, star.radius, star.radius);

    });

    requestAnimationFrame(drawStars);
}


window.addEventListener('resize', () => {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
stars.length = 0;
createStars();
});

createStars();
drawStars();
function approach(value, target, step) {
    if (Math.abs(value - target) <= step) {
        return target;
    }
    return value + Math.sign(target - value) * step;
}

function updateDeltas() {
    targetDeltaX = approach(targetDeltaX, 0, step/2)
    targetDeltaY = approach(targetDeltaY, 0, step/2)
    deltaX = approach(deltaX, targetDeltaX, step);
    deltaY = approach(deltaY, targetDeltaY, step);

    requestAnimationFrame(updateDeltas);
}

updateDeltas();
