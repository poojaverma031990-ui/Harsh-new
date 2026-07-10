// --- Fluid Dynamics Particle Field ---
(function() {
    let canvas, ctx, animationFrameId;
    let grid = []; // 2D grid of velocities [cols][rows]
    let cols, rows;
    const spacing = 20; // grid spacing
    let particles = [];
    let isMouseDown = false;
    let prevMouseX = 0, prevMouseY = 0;

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
            
            cols = Math.ceil(canvas.width / spacing) + 2;
            rows = Math.ceil(canvas.height / spacing) + 2;
            
            initGrid();
        };

        function initGrid() {
            grid = [];
            for (let x = 0; x < cols; x++) {
                grid[x] = [];
                for (let y = 0; y < rows; y++) {
                    grid[x][y] = { vx: 0, vy: 0 };
                }
            }
        }

        function initParticles() {
            particles = [];
            const count = 2500;
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: 0,
                    vy: 0,
                    age: Math.random() * 100,
                    color: Math.random() * 360
                });
            }
        }

        resize();
        initParticles();
        window.addEventListener('resize', resize);

        // --- Interaction Listeners ---
        const getMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const onStart = (e) => {
            isMouseDown = true;
            const pos = getMousePos(e);
            prevMouseX = pos.x;
            prevMouseY = pos.y;
            injectFluid(pos.x, pos.y, 0, 0);
        };

        const onMove = (e) => {
            if (!isMouseDown) return;
            const pos = getMousePos(e);
            const dx = pos.x - prevMouseX;
            const dy = pos.y - prevMouseY;
            injectFluid(pos.x, pos.y, dx, dy);
            prevMouseX = pos.x;
            prevMouseY = pos.y;
        };

        const onEnd = () => { isMouseDown = false; };

        canvas.addEventListener('mousedown', onStart);
        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseup', onEnd);
        canvas.addEventListener('touchstart', onStart);
        canvas.addEventListener('touchmove', onMove);
        canvas.addEventListener('touchend', onEnd);

        // --- Core Solver Physics ---
        function injectFluid(mx, my, dx, dy) {
            const brushRadius = config.injectionSize || 20;
            const gridX = Math.floor(mx / spacing);
            const gridY = Math.floor(my / spacing);

            const rGrid = Math.ceil(brushRadius / spacing);

            for (let x = -rGrid; x <= rGrid; x++) {
                for (let y = -rGrid; y <= rGrid; y++) {
                    const cx = gridX + x;
                    const cy = gridY + y;
                    if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
                        const dist = Math.sqrt(x*x + y*y) * spacing;
                        if (dist < brushRadius) {
                            const strength = (1 - dist / brushRadius);
                            grid[cx][cy].vx += dx * strength * 0.15;
                            grid[cx][cy].vy += dy * strength * 0.15;
                        }
                    }
                }
            }

            // Spawn dynamic colorful particles near the swipe
            for (let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * brushRadius;
                particles.push({
                    x: mx + Math.cos(angle) * r,
                    y: my + Math.sin(angle) * r,
                    vx: dx * 0.5 + (Math.random() - 0.5) * 2,
                    vy: dy * 0.5 + (Math.random() - 0.5) * 2,
                    age: 0,
                    color: (Date.now() / 50) % 360 // rolling hue
                });
                if (particles.length > 4000) particles.shift();
            }
        }

        // --- Render Loop ---
        function update() {
            animationFrameId = requestAnimationFrame(update);

            const visc = config.viscosity || 0.5;
            const dissipation = config.fadeSpeed || 0.96;
            const theme = config.colorTheme || 'Rainbow';

            // 1. Decay/Diffuse Grid Vector Fields
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    grid[x][y].vx *= dissipation;
                    grid[x][y].vy *= dissipation;
                }
            }

            // 2. Clear Screen with motion trail
            ctx.fillStyle = 'rgba(3, 7, 18, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 3. Move and Draw Particles
            ctx.lineWidth = 1.5;
            ctx.globalCompositeOperation = 'screen';

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.age += 0.5;

                // Bilinear interpolation on grid velocity
                const gx = Math.floor(p.x / spacing);
                const gy = Math.floor(p.y / spacing);

                let fvx = 0, fvy = 0;
                if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
                    fvx = grid[gx][gy].vx;
                    fvy = grid[gx][gy].vy;
                }

                p.vx = p.vx * 0.9 + fvx * visc;
                p.vy = p.vy * 0.9 + fvy * visc;

                // Move
                const prevX = p.x;
                const prevY = p.y;
                p.x += p.vx;
                p.y += p.vy;

                // Draw trail lines
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(p.x, p.y);

                // Configure theme styling
                let color;
                if (theme === 'Rainbow') {
                    color = `hsla(${p.color}, 85%, 60%, ${Math.max(0, 1 - p.age / 80)})`;
                } else if (theme === 'Cosmic Neon') {
                    color = `hsla(${280 + Math.sin(p.age * 0.01) * 40}, 90%, 65%, ${Math.max(0, 1 - p.age / 80)})`;
                } else if (theme === 'Emerald') {
                    color = `hsla(${140 + Math.sin(p.age * 0.01) * 30}, 90%, 60%, ${Math.max(0, 1 - p.age / 80)})`;
                } else { // Solar Flare
                    color = `hsla(${20 + Math.sin(p.age * 0.01) * 20}, 95%, 55%, ${Math.max(0, 1 - p.age / 80)})`;
                }

                ctx.strokeStyle = color;
                ctx.stroke();

                // Respawn old or out-of-bounds particles
                if (p.age > 80 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
                    p.x = Math.random() * canvas.width;
                    p.y = Math.random() * canvas.height;
                    p.vx = (Math.random() - 0.5) * 1;
                    p.vy = (Math.random() - 0.5) * 1;
                    p.age = 0;
                    p.color = Math.random() * 360;
                }
            }

            ctx.globalCompositeOperation = 'source-over';
        }

        update();

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
                if (paramId === 'colorTheme') {
                    initParticles();
                }
            },
            destroy: function() {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resize);
                
                canvas.removeEventListener('mousedown', onStart);
                canvas.removeEventListener('mousemove', onMove);
                canvas.removeEventListener('mouseup', onEnd);
                canvas.removeEventListener('touchstart', onStart);
                canvas.removeEventListener('touchmove', onMove);
                canvas.removeEventListener('touchend', onEnd);

                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }
        };
    };
})();
