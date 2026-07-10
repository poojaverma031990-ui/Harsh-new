// --- Retro Vaporwave Endless Driving Sandbox ---
(function() {
    let canvas, ctx, animationFrameId;
    let driveOffset = 0;
    let steerSway = 0;
    let targetSteer = 0;

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

        // Track swipe steer
        const onInteraction = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            
            // Normalize touch between -1 and 1
            const normalizedX = (clientX - rect.left) / canvas.width * 2 - 1;
            targetSteer = normalizedX * 2.0; // max steering range
        };

        canvas.addEventListener('mousemove', onInteraction);
        canvas.addEventListener('touchmove', onInteraction);

        // --- Render Frame ---
        function render() {
            animationFrameId = requestAnimationFrame(render);

            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const speed = config.driveSpeed || 60;
            const sunPulse = config.sunVibe || 1.0;
            const theme = config.retroTone || 'Outrun Neon';
            const steeringScale = config.steeringFric || 5;

            // Increment coordinates
            driveOffset += speed * 0.002;
            
            // Linear interpolate steering target
            steerSway += (targetSteer - steerSway) * (steeringScale * 0.015);

            const halfW = canvas.width / 2;
            const halfH = canvas.height / 2;
            const horizon = halfH * 0.95;

            // Define neon coloring theme tokens
            let colorPrimary = '#ff007f';
            let colorSecondary = '#bd00ff';
            if (theme === 'Outrun Neon') { colorPrimary = '#ff007f'; colorSecondary = '#bd00ff'; }
            else if (theme === 'Sunset Gold') { colorPrimary = '#ffd700'; colorSecondary = '#ff3b30'; }
            else { colorPrimary = '#bd00ff'; colorSecondary = '#00f0ff'; }

            // 1. Draw glowing background grid sun
            const sunSize = 75;
            const sunGlow = ctx.createLinearGradient(halfW, horizon - sunSize, halfW, horizon);
            sunGlow.addColorStop(0, '#ffd700');
            sunGlow.addColorStop(0.5, colorPrimary);
            sunGlow.addColorStop(1, 'transparent');

            const pulseOffset = 1 + Math.sin(Date.now() * 0.003) * 0.04 * sunPulse;

            ctx.beginPath();
            ctx.arc(halfW, horizon, sunSize * pulseOffset, Math.PI, 0, false);
            ctx.fillStyle = sunGlow;
            ctx.fill();

            // Draw sun lines slice
            ctx.fillStyle = '#030712';
            for (let y = horizon - sunSize * 2; y < horizon; y += 7) {
                const sliceH = (y - (horizon - sunSize * 2)) / (sunSize * 2) * 3;
                ctx.fillRect(halfW - sunSize * 2, y, sunSize * 4, sliceH);
            }

            // 2. Draw 3D scrolling perspective ground grid lines
            ctx.lineWidth = 1.0;
            ctx.strokeStyle = colorPrimary;

            const gridSpacing = 24;
            const depthSpacing = 16;

            for (let i = -gridSpacing; i <= gridSpacing; i++) {
                ctx.beginPath();
                ctx.moveTo(halfW, horizon);
                const targetX = halfW + (i - steerSway) * (canvas.width / gridSpacing) * 3;
                ctx.lineTo(targetX, canvas.height);
                ctx.stroke();
            }

            // Draw horizontal dividers
            ctx.strokeStyle = colorSecondary;
            for (let i = 0; i < depthSpacing; i++) {
                const z = (i + (driveOffset % 1)) / depthSpacing;
                const y = horizon + (canvas.height - horizon) * Math.pow(z, 2.5);

                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // 3. Draw Low-Poly Sports Car outline
            ctx.save();
            ctx.translate(halfW + steerSway * 60, canvas.height * 0.85);

            // Car chassis glowing box
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#ffffff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 12;

            ctx.beginPath();
            ctx.moveTo(-45, 10);
            ctx.lineTo(-40, -10);
            ctx.lineTo(40, -10);
            ctx.lineTo(45, 10);
            ctx.closePath();
            ctx.stroke();

            // Windshield glowing line
            ctx.beginPath();
            ctx.moveTo(-25, -10);
            ctx.lineTo(-15, -25);
            ctx.lineTo(15, -25);
            ctx.lineTo(25, -10);
            ctx.closePath();
            ctx.stroke();

            // Taillights glowing red bars
            ctx.fillStyle = '#ff3b30';
            ctx.fillRect(-35, 0, 15, 4);
            ctx.fillRect(20, 0, 15, 4);

            ctx.shadowBlur = 0; // reset
            ctx.restore();

            // Instructions text
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.font = '11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('MOVE TOUCH SCREEN LEFT/RIGHT TO STEER WIREFRAME CHASSIS', halfW, canvas.height * 0.96);
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

                canvas.removeEventListener('mousemove', onInteraction);
                canvas.removeEventListener('touchmove', onInteraction);

                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }
        };
    };
})();
