// --- Sacred Geometry Kaleidoscope Painter ---
(function() {
    let canvas, ctx;
    let paths = [];
    let isDrawing = false;
    let hue = 0;

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
            clearBackground();
        };

        function clearBackground() {
            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        resize();
        window.addEventListener('resize', resize);

        // --- Drag Drawing Core ---
        const getMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const drawMirrorStroke = (x1, y1, x2, y2) => {
            const symmetry = config.mirrorSymmetry || 12;
            const brushSize = config.brushSize || 6;
            const glow = config.glowIntensity || 15;
            const hueCycle = config.hueCycle || 4;

            hue += hueCycle * 0.1;

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Translate strokes relative to center pivot coordinates
            const rx1 = x1 - cx;
            const ry1 = y1 - cy;
            const rx2 = x2 - cx;
            const ry2 = y2 - cy;

            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = `hsla(${hue % 360}, 95%, 60%, 0.8)`;
            ctx.shadowColor = `hsla(${hue % 360}, 95%, 65%, 0.9)`;
            ctx.shadowBlur = glow;

            for (let i = 0; i < symmetry; i++) {
                const angle = (i / symmetry) * Math.PI * 2;
                
                // Rotational transform coordinates
                const xStart = cx + rx1 * Math.cos(angle) - ry1 * Math.sin(angle);
                const yStart = cy + rx1 * Math.sin(angle) + ry1 * Math.cos(angle);
                const xEnd = cx + rx2 * Math.cos(angle) - ry2 * Math.sin(angle);
                const yEnd = cy + rx2 * Math.sin(angle) + ry2 * Math.cos(angle);

                ctx.beginPath();
                ctx.moveTo(xStart, yStart);
                ctx.lineTo(xEnd, yEnd);
                ctx.stroke();

                // Draw secondary mirrored horizontal reflection
                const xStartRef = cx - (rx1 * Math.cos(angle) - ry1 * Math.sin(angle));
                const xEndRef = cx - (rx2 * Math.cos(angle) - ry2 * Math.sin(angle));

                ctx.beginPath();
                ctx.moveTo(xStartRef, yStart);
                ctx.lineTo(xEndRef, yEnd);
                ctx.stroke();
            }

            ctx.shadowBlur = 0; // reset
        };

        let lastX = 0, lastY = 0;

        const onStart = (e) => {
            isDrawing = true;
            const pos = getMousePos(e);
            lastX = pos.x;
            lastY = pos.y;
        };

        const onMove = (e) => {
            if (!isDrawing) return;
            const pos = getMousePos(e);
            drawMirrorStroke(lastX, lastY, pos.x, pos.y);
            lastX = pos.x;
            lastY = pos.y;
        };

        const onEnd = () => { isDrawing = false; };

        canvas.addEventListener('mousedown', onStart);
        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseup', onEnd);
        canvas.addEventListener('touchstart', onStart);
        canvas.addEventListener('touchmove', onMove);
        canvas.addEventListener('touchend', onEnd);

        // Constant radial star glow inside background loop
        function drawBackgroundGuides() {
            if (isDrawing) return; // avoid guide lines overlaying painting
            ctx.fillStyle = 'rgba(3, 7, 18, 0.015)'; // extremely low fading decay
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const loopId = setInterval(drawBackgroundGuides, 60);

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
            },
            destroy: function() {
                clearInterval(loopId);
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
