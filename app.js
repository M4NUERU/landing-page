document.addEventListener('DOMContentLoaded', () => {
    // 0. La Trama "Living Weave" - Enhanced Digital Fabric
    const canvas = document.getElementById('bg-particles');
    if (canvas) {
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

    // 5. Chat Assistant Logic (Mascot Eye Tracking)
    const chatToggle = document.getElementById('chat-toggle');
    const pupils = document.querySelectorAll('.pupil');

    // Mascot Eye Tracking Logic
    window.addEventListener('mousemove', (e) => {
        if (!chatToggle) return;

        const rect = chatToggle.getBoundingClientRect();
        const mascotX = rect.left + rect.width / 2;
        const mascotY = rect.top + rect.height / 2;

        const dx = e.clientX - mascotX;
        const dy = e.clientY - mascotY;
        const angle = Math.atan2(dy, dx);

        const distance = Math.min(Math.hypot(dx, dy) / 40, 3); // Max move 3px

        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        pupils.forEach(pupil => {
            pupil.style.transform = `translate(${tx}px, ${ty}px)`;
        });
    });

    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    const chatResponses = {
        'precio': 'IXTA ofrece planes flexibles basados en módulos. Puedes empezar desde $49/mes. ¿Te gustaría ver la tabla comparativa?',
        'modulos': 'Tenemos módulos de Finanzas, CRM, Inventario, Ventas, Manufactura y RRHH. Todos integrados nativamente.',
        'implementacion': 'Nuestra implementación promedio tarda solo 2 semanas gracias a nuestra arquitectura modular pre-configurada.',
        'seguridad': 'Contamos con encriptación AES-256 y cumplimos con normativas ISO 27001 y SOC 2.',
        'demo': '¡Genial! Puedes agendar una demo directamente pulsando el botón verde en mi ventana o en la página de contacto.',
        'default': 'Interesante pregunta. Como IA de IXTA, puedo decirte que nuestra plataforma se adapta a cualquier industria. ¿Quieres hablar con un experto?'
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
                <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-muted);">Un experto de IXTA se pondrá en contacto pronto.</p>
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
