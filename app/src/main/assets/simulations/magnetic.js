// --- Magnetic Field lines Visualizer ---
(function() {
    let canvas, ctx, animationFrameId;
    let magnets = [];
    let dragIndex = -1;

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
            initMagnets();
        };

        function initMagnets() {
            magnets = [];
            const count = config.magnetCount || 2;
            
            // Spawn North/South magnetic monopoles symmetrically
            for (let i = 0; i < count; i++) {
                magnets.push({
                    x: canvas.width * (0.3 + i * 0.4 / (count - 1 || 1)),
                    y: canvas.height * 0.5 + (i % 2 === 0 ? -40 : 40),
                    charge: i % 2 === 0 ? 1 : -1, // alternating North/South poles
                    radius: 20
                });
            }
        }

        resize();
        window.addEventListener('resize', resize);

        // --- Draggable Magnet listeners ---
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
            dragIndex = -1;
            
            // See if clicked on any magnet sphere
            for (let i = 0; i < magnets.length; i++) {
                const m = magnets[i];
                const dist = Math.sqrt((m.x - pos.x)**2 + (m.y - pos.y)**2);
                if (dist < m.radius + 15) {
                    dragIndex = i;
                    break;
                }
            }
        };

        const onMove = (e) => {
            if (dragIndex === -1) return;
            const pos = getMousePos(e);
            magnets[dragIndex].x = pos.x;
            magnets[dragIndex].y = pos.y;
        };

        const onEnd = () => { dragIndex = -1; };

        canvas.addEventListener('mousedown', onStart);
        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseup', onEnd);
        canvas.addEventListener('touchstart', onStart);
        canvas.addEventListener('touchmove', onMove);
        canvas.addEventListener('touchend', onEnd);

        // --- Render Frame ---
        function render() {
            animationFrameId = requestAnimationFrame(render);

            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Print info
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('DRAG RED (NORTH) / BLUE (SOUTH) MAGNETIC POLES', canvas.width / 2, canvas.height * 0.08);

            const strength = config.poleStrength || 15;
            const density = config.needlesDensity || 400;
            const style = config.visualCore || 'Iron Needles';

            // Calculate grid spacing for magnetic compasses
            const spacing = Math.sqrt((canvas.width * canvas.height) / density);
            const cols = Math.floor(canvas.width / spacing);
            const rows = Math.floor(canvas.height / spacing);

            ctx.lineWidth = 1.5;

            // Draw Vector Fields
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = (c + 0.5) * spacing;
                    const y = (r + 0.5) * spacing;

                    // Compute vector sum of magnetic fields
                    let fx = 0;
                    let fy = 0;

                    magnets.forEach(m => {
                        const dx = x - m.x;
                        const dy = y - m.y;
                        const distSqr = dx*dx + dy*dy;
                        const dist = Math.sqrt(distSqr);
                        if (dist === 0) return;

                        // Field scales with 1/r^2
                        const fieldStrength = (strength * 12) / distSqr;
                        fx += (dx / dist) * fieldStrength * m.charge;
                        fy += (dy / dist) * fieldStrength * m.charge;
                    });

                    // Angle of magnetic field vector tangent
                    const angle = Math.atan2(fy, fx);
                    
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);

                    // Draw styled directional vectors
                    if (style === 'Iron Needles') {
                        ctx.strokeStyle = 'rgba(100, 116, 139, 0.55)';
                        ctx.beginPath();
                        ctx.moveTo(-6, 0);
                        ctx.lineTo(6, 0);
                        ctx.stroke();

                        // North pointer
                        ctx.strokeStyle = '#ff3b30';
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(6, 0);
                        ctx.stroke();
                    } else { // Flow particles or Heatmap
                        ctx.strokeStyle = '#00f0ff';
                        ctx.beginPath();
                        ctx.moveTo(-4, 0);
                        ctx.lineTo(4, 0);
                        ctx.stroke();
                    }

                    ctx.restore();
                }
            }

            // Draw Magnets Monopoles
            magnets.forEach(m => {
                ctx.beginPath();
                ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
                ctx.fillStyle = m.charge > 0 ? '#ff3b30' : '#00f0ff'; // Red=North, Blue=South
                ctx.fill();

                // Draw label N/S
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(m.charge > 0 ? 'N' : 'S', m.x, m.y);
            });
        }

        render();

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
                if (paramId === 'magnetCount') {
                    initMagnets();
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
