// --- Inverse Kinematics Procedural Creature Tentacles ---
(function() {
    let canvas, ctx, animationFrameId;
    let mouse = { x: 0, y: 0 };
    let tentacles = [];

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
            
            mouse.x = canvas.width / 2;
            mouse.y = canvas.height / 2;
            initCreature();
        };

        function initCreature() {
            tentacles = [];
            const tCount = config.legCount || 6;
            const segmentCount = 15;
            const segmentLength = Math.min(canvas.width, canvas.height) * 0.025;

            for (let i = 0; i < tCount; i++) {
                const baseAngle = (i / tCount) * Math.PI * 2;
                const segments = [];
                
                // Segment coordinates
                let lx = canvas.width / 2;
                let ly = canvas.height / 2;

                for (let j = 0; j < segmentCount; j++) {
                    segments.push({
                        x: lx,
                        y: ly,
                        len: segmentLength * (1 - j / segmentCount * 0.45) // taper out
                    });
                    lx += Math.cos(baseAngle) * segmentLength;
                    ly += Math.sin(baseAngle) * segmentLength;
                }

                tentacles.push({
                    segments: segments,
                    baseX: canvas.width / 2,
                    baseY: canvas.height / 2,
                    angle: baseAngle
                });
            }
        }

        resize();
        window.addEventListener('resize', resize);

        // Track cursor
        const onMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            mouse.x = clientX - rect.left;
            mouse.y = clientY - rect.top;
        };

        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('touchmove', onMove);

        // --- IK Solver Engine (Backward/Forward pass) ---
        function solveIK(tentacle) {
            const segments = tentacle.segments;
            const reflex = config.moveSpeed || 0.15;

            // Target lead follows cursor
            let targetX = mouse.x;
            let targetY = mouse.y;

            // 1. Backward Pass (constrain endpoints to cursor targets)
            for (let i = segments.length - 1; i >= 0; i--) {
                const s = segments[i];
                const dx = targetX - s.x;
                const dy = targetY - s.y;
                const angle = Math.atan2(dy, dx);

                s.x = targetX - Math.cos(angle) * s.len;
                s.y = targetY - Math.sin(angle) * s.len;

                targetX = s.x;
                targetY = s.y;
            }

            // 2. Forward Pass (constrain root coordinates to barycentric spine center)
            let rootX = tentacle.baseX;
            let rootY = tentacle.baseY;

            for (let i = 0; i < segments.length; i++) {
                const s = segments[i];
                const dx = s.x - rootX;
                const dy = s.y - rootY;
                const angle = Math.atan2(dy, dx);

                s.x = rootX;
                s.y = rootY;

                rootX += Math.cos(angle) * s.len;
                rootY += Math.sin(angle) * s.len;
            }
        }

        // --- Render Loop ---
        function render(now) {
            animationFrameId = requestAnimationFrame(render);

            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Animate creature spine core slithering smoothly towards cursor
            const spineX = canvas.width / 2;
            const spineY = canvas.height / 2;
            
            const reflex = config.moveSpeed || 0.15;
            const style = config.skinStyle || 'Glowing Armor';

            tentacles.forEach(t => {
                t.baseX = spineX + Math.sin(now * 0.002 + t.angle) * 15;
                t.baseY = spineY + Math.cos(now * 0.002 + t.angle) * 15;

                solveIK(t);

                // Draw tentacles segments
                ctx.lineCap = 'round';
                
                for (let j = 0; j < t.segments.length; j++) {
                    const s = t.segments[j];
                    
                    ctx.beginPath();
                    if (j === 0) {
                        ctx.moveTo(t.baseX, t.baseY);
                    } else {
                        ctx.moveTo(t.segments[j-1].x, t.segments[j-1].y);
                    }
                    ctx.lineTo(s.x, s.y);

                    // Set styling values
                    if (style === 'Glowing Armor') {
                        ctx.strokeStyle = `hsla(${200 + j * 8}, 95%, 60%, 0.85)`;
                        ctx.lineWidth = Math.max(2, 14 - j * 0.85);
                    } else if (style === 'Luminous Bones') {
                        ctx.strokeStyle = '#00ff66';
                        ctx.lineWidth = 3;
                    } else {
                        ctx.strokeStyle = `rgba(189, 0, 255, ${0.3 + (1 - j / t.segments.length) * 0.7})`;
                        ctx.lineWidth = 1.5;
                    }

                    ctx.stroke();
                }
            });

            // Draw glowing creature skull / center nucleus
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(spineX, spineY, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }

        render(0);

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
                if (paramId === 'legCount') {
                    initCreature();
                }
            },
            destroy: function() {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resize);
                
                canvas.removeEventListener('mousemove', onMove);
                canvas.removeEventListener('touchmove', onMove);

                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }
        };
    };
})();
