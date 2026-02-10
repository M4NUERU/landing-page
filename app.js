document.addEventListener('DOMContentLoaded', () => {
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

    // 3. NLP Conversational UI Logic (Simulated)
    const nlpInput = document.getElementById('nlp-input');
    const nlpBtn = document.getElementById('nlp-search');
    const nlpResponse = document.getElementById('nlp-response');

    const responses = {
        'inventario': 'Generando vista de Inventario Predictivo... He detectado 3 cuellos de botella en tu cadena de suministro. ¿Quieres ver el reporte de mitigación?',
        'finanzas': 'Abriendo Dashboard Financiero Consolidado. Hemos procesado $4.2B este trimestre con un 99.9% de precisión en conciliación.',
        'manufactura': 'Cargando visualización de Planta 4. La eficiencia (OEE) promedio actual es del 92%. Se recomienda optimizar la Línea B.',
        'default': 'Entiendo tu consulta. Estoy generando una vista personalizada basada en los datos de tu industria. Un momento...'
    };

    const handleNLP = () => {
        const query = nlpInput.value.toLowerCase();
        nlpResponse.innerHTML = '<p style="color: var(--accent);">IA Procesando...</p>';

        let found = false;
        setTimeout(() => {
            for (const key in responses) {
                if (query.includes(key)) {
                    nlpResponse.innerHTML = `
                        <div style="border-left: 2px solid var(--accent); padding-left: 1rem;">
                            <p style="font-weight: 600; margin-bottom: 0.5rem;">Respuesta de MODULR IA:</p>
                            <p>${responses[key]}</p>
                            <button class="btn btn-primary" style="margin-top: 1rem; padding: 0.5rem 1rem; font-size: 0.8rem;">Ver Detalles</button>
                        </div>
                    `;
                    found = true;
                    break;
                }
            }
            if (!found) {
                nlpResponse.innerHTML = `<p>${responses.default}</p>`;
            }
        }, 800);
    };

    nlpBtn.addEventListener('click', handleNLP);
    nlpInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleNLP();
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
