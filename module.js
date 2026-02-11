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
    document.title = `MODULR ERP | ${data.title}`;
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
    let particles = [];
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        const count = (canvas.width * canvas.height) / 15000;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() - 0.5) * 0.8,
                dy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 2 + 1
            });
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            if (p.x > canvas.width || p.x < 0) p.dx = -p.dx;
            if (p.y > canvas.height || p.y < 0) p.dy = -p.dy;
            let dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
            if (dist < mouse.radius) {
                if (mouse.x < p.x && p.x < canvas.width - 10) p.x += 3;
                if (mouse.x > p.x && p.x > 10) p.x -= 3;
                if (mouse.y < p.y && p.y < canvas.height - 10) p.y += 3;
                if (mouse.y > p.y && p.y > 10) p.y -= 3;
            }
            p.x += p.dx;
            p.y += p.dy;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
            ctx.fill();
        });

        // Connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                let d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (d < 120) {
                    ctx.strokeStyle = `rgba(212, 175, 55, ${1 - d / 120})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();
}
