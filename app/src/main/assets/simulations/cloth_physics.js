// --- Interactive Cloth Physics ---
(function() {
    let canvas, ctx, animationFrameId;
    let particles = [];
    let constraints = [];
    
    let isDragging = false;
    let dragParticle = null;

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
            initCloth();
        };

        function initCloth() {
            particles = [];
            constraints = [];

            const cols = 20;
            const rows = 14;
            const spacingX = Math.min(canvas.width, canvas.height) * 0.032;
            const spacingY = spacingX;

            const startX = (canvas.width - cols * spacingX) / 2;
            const startY = canvas.height * 0.1;

            // 1. Create Particles
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const px = startX + x * spacingX;
                    const py = startY + y * spacingY;
                    const p = {
                        x: px,
                        y: py,
                        px: px,
                        py: py,
                        pinned: y === 0 // Top row is anchored!
                    };
                    particles.push(p);
                }
            }

            // 2. Connect Springs
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const idx = y * cols + x;
                    // Horizontal link
                    if (x < cols - 1) {
                        constraints.push({
                            p1: particles[idx],
                            p2: particles[idx + 1],
                            len: spacingX,
                            torn: false
                        });
                    }
                    // Vertical link
                    if (y < rows - 1) {
                        constraints.push({
                            p1: particles[idx],
                            p2: particles[idx + cols],
                            len: spacingY,
                            torn: false
                        });
                    }
                }
            }
        }

        resize();
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
            const pos = getMousePos(e);
            
            // Find closest particle
            let minDist = 30;
            dragParticle = null;
            particles.forEach(p => {
                const dist = Math.sqrt((p.x - pos.x)**2 + (p.y - pos.y)**2);
                if (dist < minDist) {
                    minDist = dist;
                    dragParticle = p;
                }
            });

            isDragging = true;
        };

        const onMove = (e) => {
            const pos = getMousePos(e);
            if (isDragging && dragParticle) {
                // Pin drag particle coordinates directly
                dragParticle.x = pos.x;
                dragParticle.y = pos.y;
            }

            // Tear connections if user swipes quickly near links
            if (isDragging && !dragParticle) {
                constraints.forEach(c => {
                    if (c.torn) return;
                    const mx = (c.p1.x + c.p2.x) / 2;
                    const my = (c.p1.y + c.p2.y) / 2;
                    const dist = Math.sqrt((mx - pos.x)**2 + (my - pos.y)**2);
                    if (dist < 15) {
                        c.torn = true;
                    }
                });
            }
        };

        const onEnd = () => {
            isDragging = false;
            dragParticle = null;
        };

        canvas.addEventListener('mousedown', onStart);
        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseup', onEnd);
        canvas.addEventListener('touchstart', onStart);
        canvas.addEventListener('touchmove', onMove);
        canvas.addEventListener('touchend', onEnd);

        // --- Physical Verlet integration loop ---
        function update() {
            // Apply forces
            const gravityForce = (config.gravity !== undefined ? config.gravity : 1.0) * 0.35;
            const wind = config.windStrength || 0;
            const stiffness = config.structuralStiffness || 8;

            particles.forEach(p => {
                if (p.pinned) return;
                
                const vx = (p.x - p.px) * 0.99; // 1% friction damping
                const vy = (p.y - p.py) * 0.99;

                p.px = p.x;
                p.py = p.y;

                // Wind wave oscillation
                const windForce = Math.sin(Date.now() * 0.003 + p.y * 0.01) * wind * 0.2;

                p.x += vx + windForce;
                p.y += vy + gravityForce;
            });

            // Satisfy Constraints multiple iterations (relaxation)
            for (let iter = 0; iter < stiffness; iter++) {
                constraints.forEach(c => {
                    if (c.torn) return;

                    const dx = c.p2.x - c.p1.x;
                    const dy = c.p2.y - c.p1.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist === 0) return;

                    const diff = (c.len - dist) / dist * 0.5;
                    const offsetX = dx * diff;
                    const offsetY = dy * diff;

                    if (!c.p1.pinned) {
                        c.p1.x -= offsetX;
                        c.p1.y -= offsetY;
                    }
                    if (!c.p2.pinned) {
                        c.p2.x += offsetX;
                        c.p2.y += offsetY;
                    }
                });
            }

            // Draw Cloth
            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const visualMode = config.renderStyle || 'Neon Wireframe';

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#00ff66';

            constraints.forEach(c => {
                if (c.torn) return;
                
                ctx.beginPath();
                ctx.moveTo(c.p1.x, c.p1.y);
                ctx.lineTo(c.p2.x, c.p2.y);

                if (visualMode === 'Neon Wireframe') {
                    ctx.strokeStyle = '#00ff66';
                } else if (visualMode === 'Shaded Grid') {
                    ctx.strokeStyle = 'rgba(255, 0, 127, 0.45)';
                } else {
                    ctx.strokeStyle = '#00f0ff';
                }

                ctx.stroke();
            });

            // Draw Node nodes
            if (visualMode === 'Node Clusters') {
                ctx.fillStyle = '#ffffff';
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            animationFrameId = requestAnimationFrame(update);
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
