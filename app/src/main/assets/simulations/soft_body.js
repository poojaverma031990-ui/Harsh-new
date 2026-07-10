// --- Viscoelastic Soft Body Blob ---
(function() {
    let canvas, ctx, animationFrameId;
    let center = { x: 0, y: 0, vx: 0, vy: 0 };
    let nodes = [];
    const nodeCount = 12;
    let radius = 70;

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
            
            radius = Math.min(canvas.width, canvas.height) * 0.12;
            initBlob();
        };

        function initBlob() {
            center = {
                x: canvas.width / 2,
                y: canvas.height * 0.3,
                vx: 0,
                vy: 0
            };

            nodes = [];
            for (let i = 0; i < nodeCount; i++) {
                const angle = (i / nodeCount) * Math.PI * 2;
                nodes.push({
                    x: center.x + Math.cos(angle) * radius,
                    y: center.y + Math.sin(angle) * radius,
                    vx: 0,
                    vy: 0,
                    restAngle: angle
                });
            }
        }

        resize();
        window.addEventListener('resize', resize);

        // Drag to sling
        let isDragging = false;

        const onStart = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const mx = clientX - rect.left;
            const my = clientY - rect.top;

            const dist = Math.sqrt((mx - center.x)**2 + (my - center.y)**2);
            if (dist < radius * 1.5) {
                isDragging = true;
            }
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            center.x = clientX - rect.left;
            center.y = clientY - rect.top;
            center.vx = 0;
            center.vy = 0;
        };

        const onEnd = () => { isDragging = false; };

        canvas.addEventListener('mousedown', onStart);
        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseup', onEnd);
        canvas.addEventListener('touchstart', onStart);
        canvas.addEventListener('touchmove', onMove);
        canvas.addEventListener('touchend', onEnd);

        // --- Core Soft Body Dynamics Solver ---
        function solvePhysics() {
            const stiffness = config.stiffness || 6.0;
            const pressure = config.internalPressure || 2.2;
            const gravity = (config.blobGravity !== undefined ? config.blobGravity : 1.2) * 0.25;

            // 1. Move Center
            if (!isDragging) {
                center.vy += gravity;
                center.x += center.vx;
                center.y += center.vy;

                // Damp center coordinates
                center.vx *= 0.99;
                center.vy *= 0.99;
            }

            // Resolve center wall collision
            if (center.y > canvas.height - radius * 0.8) {
                center.y = canvas.height - radius * 0.8;
                center.vy = -Math.abs(center.vy) * 0.6;
            }
            if (center.x < radius * 0.8) {
                center.x = radius * 0.8;
                center.vx = Math.abs(center.vx) * 0.6;
            }
            if (center.x > canvas.width - radius * 0.8) {
                center.x = canvas.width - radius * 0.8;
                center.vx = -Math.abs(center.vx) * 0.6;
            }

            // 2. Move Outer Nodes with Springs
            nodes.forEach(n => {
                n.vy += gravity;

                // Hooke's Law spring back to target angular distance from center
                const tx = center.x + Math.cos(n.restAngle) * radius;
                const ty = center.y + Math.sin(n.restAngle) * radius;

                const springX = (tx - n.x) * stiffness * 0.008;
                const springY = (ty - n.y) * stiffness * 0.008;

                n.vx += springX;
                n.vy += springY;

                // Structural pressure spring connecting neighboring perimeter points
                nodes.forEach(other => {
                    if (other === n) return;
                    const dx = other.x - n.x;
                    const dy = other.y - n.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < radius * 0.4) {
                        const push = (radius * 0.4 - dist) * pressure * 0.015;
                        n.vx -= dx / dist * push;
                        n.vy -= dy / dist * push;
                    }
                });

                n.x += n.vx;
                n.y += n.vy;

                // Friction damping
                n.vx *= 0.96;
                n.vy *= 0.96;

                // Ground and Wall Collision
                if (n.y > canvas.height - 5) {
                    n.y = canvas.height - 5;
                    n.vy = -Math.abs(n.vy) * 0.5;
                    n.vx *= 0.8;
                    // Transfer momentum to center on squash
                    center.vy -= Math.abs(n.vy) * 0.1;
                }
                if (n.x < 5) {
                    n.x = 5;
                    n.vx = Math.abs(n.vx) * 0.5;
                }
                if (n.x > canvas.width - 5) {
                    n.x = canvas.width - 5;
                    n.vx = -Math.abs(n.vx) * 0.5;
                }
            });
        }

        // --- Render Frame ---
        function render() {
            solvePhysics();

            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Squishy Blob Outline
            ctx.beginPath();
            ctx.moveTo(nodes[0].x, nodes[0].y);
            for (let i = 1; i < nodeCount; i++) {
                // Bezier curve interpolation for organic gooey squishiness
                const midX = (nodes[i].x + nodes[i-1].x) / 2;
                const midY = (nodes[i].y + nodes[i-1].y) / 2;
                ctx.quadraticCurveTo(nodes[i-1].x, nodes[i-1].y, midX, midY);
            }
            ctx.quadraticCurveTo(nodes[nodeCount-1].x, nodes[nodeCount-1].y, nodes[0].x, nodes[0].y);
            ctx.closePath();

            // Jelly coloring
            const style = config.shapeType || 'Octagon Star';
            
            let blobGlow = ctx.createRadialGradient(center.x, center.y, 5, center.x, center.y, radius * 1.5);
            if (style === 'Octagon Star') {
                blobGlow.addColorStop(0, '#ffd700');
                blobGlow.addColorStop(0.7, '#ff007f');
            } else if (style === 'Blob Ring') {
                blobGlow.addColorStop(0, '#00f0ff');
                blobGlow.addColorStop(0.7, '#bd00ff');
            } else {
                blobGlow.addColorStop(0, '#00ff66');
                blobGlow.addColorStop(0.7, '#00f0ff');
            }
            blobGlow.addColorStop(1, 'transparent');

            ctx.fillStyle = blobGlow;
            ctx.fill();

            // Wireframe perimeter line
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Render center nucleus core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(center.x, center.y, 10, 0, Math.PI * 2);
            ctx.fill();

            animationFrameId = requestAnimationFrame(render);
        }

        render();

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
                if (paramId === 'shapeType') {
                    initBlob();
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
