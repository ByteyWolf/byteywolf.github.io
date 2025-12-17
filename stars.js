const BW = 100, BH = 150, WW = 6, WH = 8, WG = 3;

(function () {
    const c = document.getElementById('starCanvas'), ctx = c.getContext('2d');
    if (!ctx) return;

    const style = getComputedStyle(c);
    if (style.display === 'none' || style.visibility === 'hidden') return;

    let stars = [];
    const STAR_DENSITY = 0.0003;

    let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
    let targetX = mouseX, targetY = mouseY;

    window.addEventListener('mousemove', e => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function createStars() {
        stars.length = 0;

        const starCount = Math.floor(c.width * (c.height / 2) * STAR_DENSITY);

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * c.width,
                y: Math.random() * (c.height / 2), // only upper half
                r: Math.random() * 3.5 + 0.5,
                alpha: Math.random(),
                delta: Math.random() * 0.02 + 0.005
            });
        }
    }

    function drawStars() {
        for (let star of stars) {
            star.alpha += star.delta;
            if (star.alpha > 1) { star.alpha = 1; star.delta *= -1; }
            if (star.alpha < 0) { star.alpha = 0; star.delta *= -1; }

            ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    let running = true;
    let forceStop = false;
    function resize() { c.width = window.innerWidth; c.height = window.innerHeight; running = true; createStars(); }
    resize();
    window.addEventListener('resize', resize);

    c.addEventListener('click', () => {
       forceStop = !forceStop;
    });

    const off = document.createElement('canvas');
    off.width = 400;
    off.height = 250;
    const octx = off.getContext('2d');
    const bc = Math.floor(off.width / BW);
    const mh = off.height - BH;

    octx.clearRect(0, 0, off.width, off.height);
    for (let n = 0; n < bc; n++) {
        const x = n * BW;
        const h = BH + (n / (bc - 1)) * mh;
        const y = off.height - h;
        octx.fillStyle = '#1a1a1a';
        octx.fillRect(x, y, BW - 2, h);
        octx.fillStyle = '#0a0a0a';
        octx.fillRect(x + 1, y + 1, BW - 4, h - 2);

        const rows = Math.floor((h - 20) / (WH + WG));
        const cols = Math.floor((BW - 10) / (WW + WG));
        for (let r = 0; r < rows; r++) {
            for (let col = 0; col < cols; col++) {
                const wx = x + 5 + col * (WW + WG);
                const wy = y + 10 + r * (WH + WG);
                const lit = Math.random() > 0.3;
                octx.fillStyle = lit ? '#115511' : '#222222';
                octx.fillRect(wx, wy, WW, WH);
            }
        }
    }

    const HR = 0.6, D = 4000, L1 = 20, L2 = 15, Z1 = 200, Z2 = 250, SP1 = 0.25, SP2 = 0.5;
    let z1 = 0, z2 = 0;
    let lastTime = performance.now();

    // todo: make this more or less consistent across devices
    function draw(time) {
        const aspectRatio = c.width / c.height;

        if (running) {
            ctx.filter = 'none';
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, c.width, c.height);

            drawStars();
            //ctx.filter = 'blur(5px)';

            const hz = c.height * HR;
            const cx = c.width / 2;

            const ground_gradient = ctx.createLinearGradient(0, c.height * HR, 0, c.height);
            ground_gradient.addColorStop(0, '#000000');
            ground_gradient.addColorStop(1, '#003300');

            ctx.fillStyle = ground_gradient
            ctx.fillRect(0, hz, c.width, hz);

            const baseSpread = 50;
            const spread = baseSpread * Math.max(1, aspectRatio * 0.8);

            const dt = (time - lastTime) / 1000;
            lastTime = time;
            z1 += SP1 * dt * 60;
            z2 += SP2 * dt * 60;

            let offsetX = (mouseX - cx) * 0.05;
            let offsetY = (mouseY - hz) * 0.05;

            const buildings1 = [];
            for (let i = 0; i < L1; i++) {
                const z = (i * Z1 + z1) % D;
                buildings1.push({ i, z });
            }
            buildings1.sort((b, a) => b.z - a.z);

            for (const b of buildings1) {
                const s = D / (D - b.z);
                const sy = hz + s * 100;
                const bw = BW * s;
                const bh = off.height * s * 1.1;
                const idx = (b.i * 7) % bc;
                const sx = idx * BW;
                const side = spread * Math.pow(s, 1.5); 
                const alpha = Math.pow(b.z / D, 0.2);
                ctx.globalAlpha = alpha;
                ctx.drawImage(off, sx, 0, BW, off.height, cx - side - bw + offsetX, sy - bh + offsetY, bw, bh);
                ctx.drawImage(off, sx, 0, BW, off.height, cx + side + offsetX, sy - bh + offsetY, bw, bh);
            }

            // Do the same for L2 loop
            const buildings2 = [];
            for (let i = 0; i < L2; i++) {
                const z = (i * Z2 + z2 + 100) % D;
                buildings2.push({ i, z });
            }
            buildings2.sort((b, a) => b.z - a.z);

            for (const b of buildings2) {
                const s = D / (D - b.z);
                const sy = hz + s * 105;
                const bw = BW * s;
                const bh = off.height * s / 1.1;
                const idx = (b.i * 5) % bc;
                const sx = idx * BW;
                const side = spread * Math.pow(s, 1.3); 
                const alpha = Math.pow(b.z / D, 1.2);
                ctx.globalAlpha = alpha;
                ctx.drawImage(off, sx, 0, BW, off.height, cx - side - bw + offsetX, sy - bh + offsetY, bw, bh);
                ctx.drawImage(off, sx, 0, BW, off.height, cx + side + offsetX, sy - bh + offsetY, bw, bh);

                // why not also draw a tunnel here
                
                ctx.beginPath();
                ctx.arc(c.width/2 + offsetX, c.height*HR + offsetY, bw / 5, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0,255,0,${alpha * 0.6})`;
                ctx.lineWidth = Math.max(bw * 0.01, 1);
                ctx.stroke();
            }

            ctx.globalAlpha = 0.7 + 0.3 * Math.sin(lastTime / 1000); ;
            
            if (aspectRatio > 5/3) {
            ctx.font = 'bold 12px monospace';
            ctx.fillStyle = '#00ff00';
            ctx.fillText('Click to ' + (forceStop ? 'start' : 'stop') + ' background', 10, c.height - 10);
            }

            ctx.globalAlpha = 1;

            const ease = 0.015 * dt * 60;
            mouseX += (targetX - mouseX) * ease;
            mouseY += (targetY - mouseY) * ease;
        }
        

        running = aspectRatio > 5/3 && !forceStop;

        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
})();
