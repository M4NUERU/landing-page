document.addEventListener('DOMContentLoaded', () => {
    // 1. Get module ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const modId = urlParams.get('id');

    if (!modId || !moduleData[modId]) {
        alert('Módulo no encontrado');
        window.location.href = 'index.html';
        return;
    }

    const data = moduleData[modId];

    // 2. Inject Content
    document.title = `IXTA | ${data.title}`;
    document.getElementById('module-badge').innerText = `Módulo ${modId.toUpperCase()}`;
    document.getElementById('module-title-h1').innerText = `${data.icon} ${data.title}`;
    document.getElementById('module-desc-p').innerText = data.description;

    const featureList = document.getElementById('feature-list-div');
    data.features.forEach(feature => {
        const div = document.createElement('div');
        div.className = 'feature-item';
        div.innerText = feature;
        featureList.appendChild(div);
    });

    document.getElementById('module-video-iframe').src = `https://www.youtube.com/embed/${data.videoId}`;

    // 3. Re-initialize Background Particles (Copied from app.js logic to maintain aesthetic)
    initBackground();

    // 4. Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 5. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
            document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when clicking a link
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
});

function initBackground() {
    const canvas = document.getElementById('bg-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let points = [];
    let signals = [];
    let floatingShapes = [];
    let explosions = [];
    const mouse = { x: -100, y: -100, radius: 250 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    };

    const init = () => {
        points = [];
        signals = [];
        floatingShapes = [];
        explosions = [];
        const spacing = 100;
        for (let x = 0; x < canvas.width + spacing; x += spacing) {
            for (let y = 0; y < canvas.height + spacing; y += spacing) {
                points.push({
                    x: x + (Math.random() - 0.5) * 30,
                    y: y + (Math.random() - 0.5) * 30,
                    originX: x,
                    originY: y,
                    vx: 0,
                    vy: 0,
                    pulse: Math.random() * Math.PI,
                    size: Math.random() * 1.5 + 0.5,
                    active: 0
                });
            }
        }
        for (let i = 0; i < 6; i++) spawnShape(true);
    };

    const spawnShape = (randomX = false) => {
        const side = Math.floor(Math.random() * 4); // 0: Top, 1: Right, 2: Bottom, 3: Left
        let x, y, vx, vy;
        const speed = 0.05 + Math.random() * 0.15; // Much slower

        if (side === 0) { // Top
            x = Math.random() * canvas.width; y = -50; vx = (Math.random() - 0.5) * speed; vy = speed;
        } else if (side === 1) { // Right
            x = canvas.width + 50; y = Math.random() * canvas.height; vx = -speed; vy = (Math.random() - 0.5) * speed;
        } else if (side === 2) { // Bottom
            x = Math.random() * canvas.width; y = canvas.height + 50; vx = (Math.random() - 0.5) * speed; vy = -speed;
        } else { // Left
            x = -50; y = Math.random() * canvas.height; vx = speed; vy = (Math.random() - 0.5) * speed;
        }

        floatingShapes.push({
            x: randomX ? Math.random() * canvas.width : x,
            y: randomX ? Math.random() * canvas.height : y,
            vx, vy,
            size: 15 + Math.random() * 45, // Varied sizes
            type: Math.floor(Math.random() * 3),
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.01
        });
    };

    const createExplosion = (x, y) => {
        for (let i = 0; i < 15; i++) {
            explosions.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                size: Math.random() * 4 + 1
            });
        }
    };

    const drawShape = (s) => {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        if (s.type === 0) {
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                ctx.lineTo(Math.cos(angle) * s.size, Math.sin(angle) * s.size);
            }
            ctx.closePath();
        } else if (s.type === 1) {
            ctx.moveTo(0, -s.size); ctx.lineTo(s.size * 0.8, 0); ctx.lineTo(0, s.size); ctx.lineTo(-s.size * 0.8, 0); ctx.closePath();
        } else {
            ctx.arc(0, 0, s.size * 0.6, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.restore();
    };

    const createSignal = () => {
        if (points.length < 1) return;
        const startIdx = Math.floor(Math.random() * points.length);
        signals.push({
            curr: startIdx,
            life: 1.0,
            speed: 0.02
        });
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.05) createSignal();

        points.forEach((p, i) => {
            p.pulse += 0.02;
            const shiftX = Math.sin(p.pulse) * 5;
            const shiftY = Math.cos(p.pulse) * 5;

            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                p.vx -= dx * force * 0.04;
                p.vy -= dy * force * 0.04;
            }

            p.vx += (p.originX - p.x) * 0.06;
            p.vy += (p.originY - p.y) * 0.06;
            p.vx *= 0.85;
            p.vy *= 0.85;
            p.x += p.vx + shiftX * 0.1;
            p.y += p.vy + shiftY * 0.1;

            p.active *= 0.94;

            const colSize = Math.ceil((canvas.height + 100) / 100);
            const neighbors = [
                points[i + 1],
                points[i + colSize]
            ];

            neighbors.forEach(n => {
                if (n && Math.abs(p.originX - n.originX) <= 100 && Math.abs(p.originY - n.originY) <= 100) {
                    const d = Math.hypot(p.x - n.x, p.y - n.y);
                    if (d < 150) {
                        let opacity = 0.03 + (p.active * 0.15);
                        if (dist < mouse.radius) {
                            opacity = (1 - dist / mouse.radius) * 0.2 + (p.active * 0.15);
                        }
                        ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
                        ctx.lineWidth = opacity * 10;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(n.x, n.y);
                        ctx.stroke();
                    }
                }
            });

            let nodeOpacity = 0.05 + p.active * 0.5;
            if (dist < mouse.radius) {
                nodeOpacity = (1 - dist / mouse.radius) * 0.6 + p.active * 0.5;
            }
            ctx.fillStyle = `rgba(212, 175, 55, ${nodeOpacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size + (nodeOpacity * 2.5), 0, Math.PI * 2);
            ctx.fill();
        });

        // Omni-directional Shapes Rendering
        floatingShapes.forEach((s, ix) => {
            s.x += s.vx; s.y += s.vy; s.rot += s.rotSpeed; drawShape(s);
            if (s.x > canvas.width + 150 || s.x < -150 || s.y > canvas.height + 150 || s.y < -150) {
                floatingShapes.splice(ix, 1); spawnShape();
            }
        });

        ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
        explosions = explosions.filter(exp => {
            exp.x += exp.vx; exp.y += exp.vy; exp.vx *= 0.96; exp.vy *= 0.96; exp.life -= 0.02;
            if (exp.life <= 0) return false;
            ctx.globalAlpha = exp.life; ctx.beginPath(); ctx.arc(exp.x, exp.y, exp.size * exp.life, 0, Math.PI * 2); ctx.fill();
            return true;
        });
        ctx.globalAlpha = 1.0;

        signals = signals.filter(s => {
            s.life -= s.speed;
            if (s.life <= 0) return false;
            const p = points[s.curr];
            if (p) p.active = s.life;
            if (Math.random() < 0.15) {
                const colSize = Math.ceil((canvas.height + 100) / 100);
                const possible = [s.curr + 1, s.curr - 1, s.curr + colSize, s.curr - colSize];
                const next = possible[Math.floor(Math.random() * possible.length)];
                if (points[next]) s.curr = next;
            }
            return true;
        });

        requestAnimationFrame(draw);
    };

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        for (let i = floatingShapes.length - 1; i >= 0; i--) {
            const s = floatingShapes[i];
            if (Math.hypot(s.x - mouseX, s.y - mouseY) < s.size) {
                createExplosion(s.x, s.y); floatingShapes.splice(i, 1); spawnShape(); break;
            }
        }
    });

    window.addEventListener('resize', resize);
    resize();
    draw();

    // Mascot Logic in Module Page
    const mascotSvg = document.querySelector('.mascot-ixti');
    if (mascotSvg) {
        setInterval(() => {
            mascotSvg.classList.add('blinking');
            setTimeout(() => mascotSvg.classList.remove('blinking'), 150);
        }, 4000 + Math.random() * 3000);

        const triggers = document.querySelectorAll('.btn, .chat-toggle, .logo');
        triggers.forEach(el => {
            el.addEventListener('mouseenter', () => mascotSvg.classList.add('surprised'));
            el.addEventListener('mouseleave', () => mascotSvg.classList.remove('surprised'));
        });
    }
}
