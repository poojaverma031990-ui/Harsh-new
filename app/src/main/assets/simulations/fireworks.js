// --- Fireworks Explosion Sandbox ---
(function() {
    let canvas, ctx, animationFrameId;
    let particles = [];

    window.initSimulation = function(container, config) {
        canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);

        ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = container.clientWidth || window.innerWidth;
            canvas.height = container.clientHeight || window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        // Click to launch fireworks
        const triggerBurst = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const mx = clientX - rect.left;
            const my = clientY - rect.top;

            const sparksCount = config.sparksCount || 120;
            const shellSize = config.fireworkShellSize || 150;
            const baseHue = Math.random() * 360;

            for (let i = 0; i < sparksCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * (shellSize * 0.05);

                particles.push({
                    x: mx,
                    y: my,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1.0,
                    decay: 0.01 + Math.random() * 0.015,
                    color: `hsla(${baseHue + (Math.random() - 0.5) * 40}, 95%, 60%, `
                });
            }
        };

        canvas.addEventListener('mousedown', triggerBurst);
        canvas.addEventListener('touchstart', triggerBurst);

        // --- Render Frame ---
        function update() {
            animationFrameId = requestAnimationFrame(update);

            ctx.fillStyle = 'rgba(3, 7, 18, 0.15)'; // motion blur trail
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const grav = config.gravity !== undefined ? config.gravity : 0.2;
            const wind = config.sparksWind !== undefined ? config.sparksWind : 0;

            // Render instructions
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('TAP TO EXPLODE MASSIVE SPARKS FIREWORKS', canvas.width / 2, canvas.height * 0.1);

            ctx.lineWidth = 1.8;

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                
                // physics math
                p.vy += grav * 0.1;
                p.vx += wind * 0.1;

                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * 1.5, p.y - p.vy * 1.5); // long trailing lines
                ctx.strokeStyle = p.color + p.alpha + ')';
                ctx.stroke();
            }
        }

        update();

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
            },
            destroy: function() {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resize);
                
                canvas.removeEventListener('mousedown', triggerBurst);
                canvas.removeEventListener('touchstart', triggerBurst);

                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }
        };
    };
})();
