// --- Newtonian Gravitational Planet Orbit Simulator ---
(function() {
    let canvas, ctx, animationFrameId;
    let bodies = [];
    let isShooting = false;
    let shootX = 0, shootY = 0;
    let currentDragX = 0, currentDragY = 0;

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

        function setupPresets() {
            bodies = [];
            const preset = config.presetSpace || 'Double Star System';

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            if (preset === 'Double Star System') {
                // Two massive stars orbiting each other
                bodies.push({ x: cx - 120, y: cy, vx: 0, vy: -1.8, mass: 600, radius: 14, color: '#ff3b30', path: [] });
                bodies.push({ x: cx + 120, y: cy, vx: 0, vy: 1.8, mass: 600, radius: 14, color: '#00f0ff', path: [] });
            } else if (preset === 'Satellite Sling') {
                // Large planet and small orbiting satellite
                bodies.push({ x: cx, y: cy, vx: 0, vy: 0, mass: 1200, radius: 24, color: '#bd00ff', path: [] });
                bodies.push({ x: cx + 180, y: cy, vx: 0, vy: -2.6, mass: 20, radius: 6, color: '#00ff66', path: [] });
            } else if (preset === 'Black Hole Feast') {
                // Hypermassive core pulling in minor moons
                bodies.push({ x: cx, y: cy, vx: 0, vy: 0, mass: 3000, radius: 18, color: '#000000', outlineColor: '#ff007f', path: [] });
                bodies.push({ x: cx - 160, y: cy - 60, vx: 1.5, vy: -2.0, mass: 30, radius: 5, color: '#ffd700', path: [] });
                bodies.push({ x: cx + 120, y: cy + 120, vx: -1.8, vy: 1.8, mass: 40, radius: 7, color: '#00f0ff', path: [] });
            }
        }

        resize();
        setupPresets();
        window.addEventListener('resize', resize);

        // --- Planet Slingshot Launch Listeners ---
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
            const pos = getMousePos(e);
            shootX = pos.x;
            shootY = pos.y;
            currentDragX = pos.x;
            currentDragY = pos.y;
            isShooting = true;
        };

        const onMove = (e) => {
            if (!isShooting) return;
            const pos = getMousePos(e);
            currentDragX = pos.x;
            currentDragY = pos.y;
        };

        const onEnd = () => {
            if (!isShooting) return;
            isShooting = false;

            // Compute sling velocity (launch velocity scales inversely to drag line)
            const dx = shootX - currentDragX;
            const dy = shootY - currentDragY;
            
            const vx = dx * 0.05;
            const vy = dy * 0.05;

            const mass = config.planetMass || 200;
            const size = Math.max(4, Math.log10(mass) * 4);

            bodies.push({
                x: shootX,
                y: shootY,
                vx: vx,
                vy: vy,
                mass: mass,
                radius: size,
                color: `hsl(${Math.random() * 360}, 90%, 65%)`,
                path: []
            });
        };

        canvas.addEventListener('mousedown', onStart);
        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseup', onEnd);
        canvas.addEventListener('touchstart', onStart);
        canvas.addEventListener('touchmove', onMove);
        canvas.addEventListener('touchend', onEnd);

        // --- Core Newtonian Universal Gravity physics ---
        function updatePhysics() {
            const G = config.gravConstant || 1.0;

            // Integrate orbits velocities
            for (let i = 0; i < bodies.length; i++) {
                const b1 = bodies[i];
                for (let j = 0; j < bodies.length; j++) {
                    if (i === j) continue;
                    const b2 = bodies[j];

                    const dx = b2.x - b1.x;
                    const dy = b2.y - b1.y;
                    const distSqr = dx*dx + dy*dy;
                    const dist = Math.sqrt(distSqr);

                    if (dist > b1.radius + b2.radius) {
                        // Standard equation F = G*m1*m2/r^2
                        const accel = (G * b2.mass) / distSqr;
                        b1.vx += (dx / dist) * accel * 0.15;
                        b1.vy += (dy / dist) * accel * 0.15;
                    }
                }
            }

            // Move bodies & record trail coordinates
            bodies.forEach(b => {
                b.x += b.vx;
                b.y += b.vy;

                b.path.push({ x: b.x, y: b.y });
                if (b.path.length > 120) b.path.shift();
            });
        }

        // --- Render Frame ---
        function render() {
            animationFrameId = requestAnimationFrame(render);
            updatePhysics();

            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Instructions text overlay
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('TAP & DRAG TO LAUNCH ORBITAL PLANETS', canvas.width / 2, canvas.height * 0.12);

            const trailDecay = config.trailsVisibility || 0.98;

            // Draw orbits path lines
            bodies.forEach(b => {
                if (b.path.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(b.path[0].x, b.path[0].y);
                    for (let i = 1; i < b.path.length; i++) {
                        ctx.lineTo(b.path[i].x, b.path[i].y);
                    }
                    ctx.strokeStyle = b.color;
                    ctx.globalAlpha = 0.45;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1.0; // reset
                }
            });

            // Draw solid planet spheres
            bodies.forEach(b => {
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = b.color;
                ctx.fill();

                if (b.outlineColor) {
                    ctx.strokeStyle = b.outlineColor;
                    ctx.lineWidth = 2.5;
                    ctx.stroke();
                }
            });

            // Draw active launch slingshot helper line
            if (isShooting) {
                ctx.beginPath();
                ctx.moveTo(shootX, shootY);
                ctx.lineTo(currentDragX, currentDragY);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]); // reset

                // Draw prospective planet outline
                ctx.beginPath();
                ctx.arc(shootX, shootY, Math.max(4, Math.log10(config.planetMass || 200) * 4), 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.fill();
            }
        }

        render();

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
                if (paramId === 'presetSpace') {
                    setupPresets();
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
