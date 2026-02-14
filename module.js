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
                    size: Math.random() * 1.5 + 0.5
                });
            }
        }
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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

            const neighbors = [
                points[i + 1],
                points[i + Math.ceil((canvas.height + 100) / 100)]
            ];

            neighbors.forEach(n => {
                if (n && Math.abs(p.originX - n.originX) <= 100 && Math.abs(p.originY - n.originY) <= 100) {
                    const d = Math.hypot(p.x - n.x, p.y - n.y);
                    if (d < 150) {
                        let opacity = 0.03;
                        if (dist < mouse.radius) {
                            opacity = (1 - dist / mouse.radius) * 0.2;
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

            let nodeOpacity = 0.05;
            if (dist < mouse.radius) {
                nodeOpacity = (1 - dist / mouse.radius) * 0.6;
            }
            ctx.fillStyle = `rgba(212, 175, 55, ${nodeOpacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size + (nodeOpacity * 2), 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();
}
