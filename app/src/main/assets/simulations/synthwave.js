// --- Cyberpunk Synthwave Wireframe Landscape ---
(function() {
    let canvas, ctx, animationFrameId;
    let offset = 0;

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

        // --- Render Loop ---
        function render() {
            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const speed = config.driveSpeed || 1.0;
            const amp = config.waveAmplitude || 4.0;
            const sunRadius = config.sunSize || 60;
            const theme = config.colorCycle || 'Retro Magenta';

            offset += speed * 0.05;

            const halfW = canvas.width / 2;
            const halfH = canvas.height / 2;
            const horizon = halfH * 0.8;

            // 1. Draw Retro Sun (with grid lines sliced)
            let sunGlow = ctx.createRadialGradient(halfW, horizon - 10, 5, halfW, horizon - 10, sunRadius * 1.5);
            
            let colorPrimary = '#ff007f';
            let colorSecondary = '#00f0ff';
            
            if (theme === 'Retro Magenta') { colorPrimary = '#ff007f'; colorSecondary = '#bd00ff'; }
            else if (theme === 'Deep Cyan') { colorPrimary = '#00f0ff'; colorSecondary = '#00ff66'; }
            else if (theme === 'Acid Yellow') { colorPrimary = '#ffd700'; colorSecondary = '#ff3b30'; }
            else { colorPrimary = '#ff3b30'; colorSecondary = '#bd00ff'; }

            sunGlow.addColorStop(0, '#ffd700');
            sunGlow.addColorStop(0.3, colorPrimary);
            sunGlow.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(halfW, horizon - 10, sunRadius, Math.PI, 0, false);
            ctx.fillStyle = sunGlow;
            ctx.fill();

            // Render sunset bands
            ctx.fillStyle = '#030712';
            for (let y = horizon - 10 - sunRadius; y < horizon - 10; y += 8) {
                const sliceH = (y - (horizon - 10 - sunRadius)) / sunRadius * 3.5;
                ctx.fillRect(halfW - sunRadius - 10, y, sunRadius * 2 + 20, sliceH);
            }

            // 2. Draw 3D Perspective Wireframe Grid
            const gridLines = 24;
            const zLines = 15;

            ctx.lineWidth = 1.2;
            ctx.strokeStyle = colorPrimary;

            // Draw Perspective Grid Lines from center horizon to bottom bounds
            for (let i = -gridLines; i <= gridLines; i++) {
                ctx.beginPath();
                ctx.moveTo(halfW, horizon);
                // Project perspective lines outwards
                const targetX = halfW + i * (canvas.width / gridLines) * 2;
                ctx.lineTo(targetX, canvas.height);
                ctx.stroke();
            }

            // Draw horizontal dividing scrollbars
            for (let i = 0; i < zLines; i++) {
                // Exponential spacing for perspective depth
                const z = (i + (offset % 1)) / zLines;
                const y = horizon + (canvas.height - horizon) * Math.pow(z, 2.5);

                ctx.strokeStyle = colorSecondary;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // 3. Draw mountains on both sides of the sunset horizon
            ctx.strokeStyle = colorSecondary;
            ctx.lineWidth = 1.5;
            
            // Left mountain range
            ctx.beginPath();
            ctx.moveTo(0, horizon);
            for (let x = 0; x < halfW * 0.7; x += 15) {
                const mountainH = Math.abs(Math.sin(x * 0.015 + offset * 0.2)) * 60 * (1 - x / (halfW * 0.7)) * (amp * 0.25);
                ctx.lineTo(x, horizon - mountainH);
            }
            ctx.lineTo(halfW * 0.7, horizon);
            ctx.stroke();

            // Right mountain range
            ctx.beginPath();
            ctx.moveTo(canvas.width, horizon);
            for (let x = canvas.width; x > halfW * 1.3; x -= 15) {
                const dist = (canvas.width - x);
                const mountainH = Math.abs(Math.cos(dist * 0.02 - offset * 0.15)) * 55 * (1 - dist / (halfW * 0.7)) * (amp * 0.25);
                ctx.lineTo(x, horizon - mountainH);
            }
            ctx.lineTo(halfW * 1.3, horizon);
            ctx.stroke();

            animationFrameId = requestAnimationFrame(render);
        }

        render();

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
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
