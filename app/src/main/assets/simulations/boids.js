// --- Boids Flocking Simulation ---
(function() {
    let canvas, ctx, animationFrameId;
    let boids = [];

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
            setupBoids();
        };

        function setupBoids() {
            boids = [];
            const count = config.boidsCount || 100;
            for (let i = 0; i < count; i++) {
                boids.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    color: Math.random() * 360
                });
            }
        }

        resize();
        window.addEventListener('resize', resize);

        // --- Core Flocking Math Solver ---
        function runFlocking() {
            const separateMult = config.separationForce || 1.5;
            const alignMult = config.alignmentForce || 1.0;
            const cohereMult = config.cohesionForce || 1.0;

            const perception = 50;

            boids.forEach(b => {
                let sCount = 0, aCount = 0, cCount = 0;
                let sx = 0, sy = 0;
                let ax = 0, ay = 0;
                let cx = 0, cy = 0;

                boids.forEach(other => {
                    if (other === b) return;
                    const dx = other.x - b.x;
                    const dy = other.y - b.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < perception) {
                        // 1. Separation force vector
                        if (dist < 20) {
                            sx -= dx / dist;
                            sy -= dy / dist;
                            sCount++;
                        }
                        // 2. Alignment force vector
                        ax += other.vx;
                        ay += other.vy;
                        aCount++;

                        // 3. Cohesion force vector
                        cx += other.x;
                        cy += other.y;
                        cCount++;
                    }
                });

                // Compute steering vectors
                if (sCount > 0) {
                    b.vx += (sx / sCount) * separateMult * 0.1;
                    b.vy += (sy / sCount) * separateMult * 0.1;
                }
                if (aCount > 0) {
                    ax /= aCount;
                    ay /= aCount;
                    b.vx += (ax - b.vx) * alignMult * 0.05;
                    b.vy += (ay - b.vy) * alignMult * 0.05;
                }
                if (cCount > 0) {
                    cx /= cCount;
                    cy /= cCount;
                    b.vx += (cx - b.x) * cohereMult * 0.005;
                    b.vy += (cy - b.y) * cohereMult * 0.005;
                }

                // Speed limit constraint
                const speed = Math.sqrt(b.vx*b.vx + b.vy*b.vy);
                const limit = 4.5;
                if (speed > limit) {
                    b.vx = (b.vx / speed) * limit;
                    b.vy = (b.vy / speed) * limit;
                }

                // Apply kinetics
                b.x += b.vx;
                b.y += b.vy;

                // Circular wraps
                if (b.x < 0) b.x = canvas.width;
                if (b.x > canvas.width) b.x = 0;
                if (b.y < 0) b.y = canvas.height;
                if (b.y > canvas.height) b.y = 0;
            });
        }

        // --- Render Frame ---
        function render() {
            animationFrameId = requestAnimationFrame(render);
            runFlocking();

            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw boids as futuristic triangles
            boids.forEach(b => {
                const angle = Math.atan2(b.vy, b.vx);
                
                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.rotate(angle);

                ctx.fillStyle = `hsla(${b.color}, 90%, 60%, 0.8)`;
                ctx.beginPath();
                ctx.moveTo(8, 0);
                ctx.lineTo(-6, -4);
                ctx.lineTo(-4, 0);
                ctx.lineTo(-6, 4);
                ctx.closePath();
                ctx.fill();

                ctx.restore();
            });
        }

        render();

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
                if (paramId === 'boidsCount') {
                    setupBoids();
                }
            },
            destroy: function() {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resize);
                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }
        };
    };
})();
