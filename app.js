document.addEventListener('DOMContentLoaded', () => {
    // 0. Antigravity Particle System
    const canvas = document.getElementById('bg-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        class Particle {
            constructor(x, y, dx, dy, size) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.size = size;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(212, 175, 55, 0.4)'; // var(--accent) Gold with opacity
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
                if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

                let dist = Math.hypot(mouse.x - this.x, mouse.y - this.y);
                if (dist < mouse.radius) {
                    if (mouse.x < this.x && this.x < canvas.width - 10) this.x += 3;
                    if (mouse.x > this.x && this.x > 10) this.x -= 3;
                    if (mouse.y < this.y && this.y < canvas.height - 10) this.y += 3;
                    if (mouse.y > this.y && this.y > 10) this.y -= 3;
                }

                this.x += this.dx;
                this.y += this.dy;
                this.draw();
            }
        }

        const init = () => {
            particles = [];
            const count = (canvas.width * canvas.height) / 15000;
            for (let i = 0; i < count; i++) {
                let size = Math.random() * 2 + 1;
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let dx = (Math.random() - 0.5) * 0.8;
                let dy = (Math.random() - 0.5) * 0.8;
                particles.push(new Particle(x, y, dx, dy, size));
            }
        };

        const connect = () => {
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
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());
            connect();
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // 1. Reveal Animations on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. Interactive Sandbox Logic
    const tabs = document.querySelectorAll('.sandbox-tab');
    const mockBody = document.querySelector('.mock-body');

    const sandboxData = {
        finanzas: `
            <div class="mock-ui-content">
                <h4 style="color: var(--accent); margin-bottom: 1rem;">Flujo de Caja en Tiempo Real</h4>
                <div style="height: 150px; background: linear-gradient(90deg, var(--accent) 0%, transparent 80%); opacity: 0.2; border-left: 2px solid var(--accent);"></div>
                <div style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div style="padding: 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border);">Egresos: $12k</div>
                    <div style="padding: 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border);">Ingresos: $45k</div>
                </div>
            </div>
        `,
        inventario: `
            <div class="mock-ui-content">
                <h4 style="color: var(--accent); margin-bottom: 1rem;">Control de Stock Automatizado</h4>
                <ul style="list-style: none;">
                    <li style="padding: 0.5rem; border-bottom: 1px solid var(--glass-border);">📦 SKU-402: 12 unidades bajas</li>
                    <li style="padding: 0.5rem; border-bottom: 1px solid var(--glass-border);">✅ SKU-112: 500 unidades (OK)</li>
                    <li style="padding: 0.5rem; border-bottom: 1px solid var(--glass-border);">🔄 Re-stock automático en 2 días</li>
                </ul>
            </div>
        `,
        manufactura: `
            <div class="mock-ui-content">
                <h4 style="color: var(--accent); margin-bottom: 1rem;">Líneas de Producción OEE</h4>
                <div style="display: flex; gap: 2rem; align-items: center;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 800;">94%</div>
                    <div>
                        <p>Línea A: Activa</p>
                        <p style="color: var(--text-muted); font-size: 0.8rem;">Próximo mantenimiento: 14h</p>
                    </div>
                </div>
            </div>
        `
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.tab;
            mockBody.style.opacity = '0';
            setTimeout(() => {
                mockBody.innerHTML = sandboxData[category];
                mockBody.style.opacity = '1';
                mockBody.style.transition = 'opacity 0.3s';
            }, 200);
        });
    });

    // Initialize with first tab
    mockBody.innerHTML = sandboxData.finanzas;

    // 5. Chat Assistant Logic
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    const chatResponses = {
        'precio': 'MODULR ofrece planes flexibles basados en módulos. Puedes empezar desde $49/mes. ¿Te gustaría ver la tabla comparativa?',
        'modulos': 'Tenemos módulos de Finanzas, CRM, Inventario, Ventas, Manufactura y RRHH. Todos integrados nativamente.',
        'implementacion': 'Nuestra implementación promedio tarda solo 2 semanas gracias a nuestra arquitectura modular pre-configurada.',
        'seguridad': 'Contamos con encriptación AES-256 y cumplimos con normativas ISO 27001 y SOC 2.',
        'demo': '¡Genial! Puedes agendar una demo directamente pulsando el botón verde en mi ventana o en la página de contacto.',
        'default': 'Interesante pregunta. Como IA de MODULR, puedo decirte que nuestra plataforma se adapta a cualquier industria. ¿Quieres hablar con un experto?'
    };

    const addChatMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerText = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleChatQuery = () => {
        const query = chatInput.value.trim().toLowerCase();
        if (!query) return;

        addChatMessage(chatInput.value, 'user');
        chatInput.value = '';

        setTimeout(() => {
            let foundResponse = chatResponses.default;
            for (const key in chatResponses) {
                if (query.includes(key)) {
                    foundResponse = chatResponses[key];
                    break;
                }
            }
            addChatMessage(foundResponse, 'ai');
        }, 600);
    };

    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        const badge = document.querySelector('.chat-badge');
        if (badge) badge.style.display = 'none';
    });

    closeChat.addEventListener('click', () => chatWindow.classList.remove('active'));
    chatSend.addEventListener('click', handleChatQuery);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatQuery();
    });
    // 4. Modal Booking Logic
    const bookingModal = document.getElementById('booking-modal');
    const openBookingBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .open-booking');
    const closeModalBtn = document.querySelector('.close-modal');
    const confirmBookingBtn = document.querySelector('.confirm-booking');

    const toggleModal = (show) => {
        if (show) {
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            bookingModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    openBookingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Only trigger booking for specifically marked buttons or demo intent
            if (btn.classList.contains('open-booking') || btn.innerText.includes('Demo') || btn.innerText.includes('Empezar')) {
                toggleModal(true);
            }
        });
    });

    closeModalBtn.addEventListener('click', () => toggleModal(false));

    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) toggleModal(false);
    });

    // 4. Mobile Menu Toggle
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

    confirmBookingBtn.addEventListener('click', () => {
        const modalBody = document.querySelector('.modal-body');
        const modalFooter = document.querySelector('.modal-footer');

        modalBody.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
                <h3 style="color: var(--accent); margin-bottom: 1rem;">¡Cita Agendada!</h3>
                <p>Hemos enviado una invitación de Google Calendar a su correo institucional.</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-muted);">Un experto de MODULR se pondrá en contacto pronto.</p>
            </div>
        `;
        modalFooter.style.display = 'none';

        setTimeout(() => {
            toggleModal(false);
            // Reset modal content after a delay
            setTimeout(() => {
                location.reload(); // Simple reset for demo purposes
            }, 500);
        }, 3000);
    });
});
