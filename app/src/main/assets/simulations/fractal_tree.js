// --- Fractal Tree Procedural Generator ---
(function() {
    let canvas, ctx;
    let offsetAngle = 0;

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
            drawTreeFrame();
        };

        resize();
        window.addEventListener('resize', resize);

        // --- Recursive Tree Drawing Core ---
        function drawBranch(startX, startY, len, angle, depth, maxDepth, angleDelta, wind) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            // Calculate wind swaying modifier (stronger wind sways thinner outer branches)
            const windSwayForce = Math.sin(Date.now() * 0.0018 + depth) * wind * 0.03 * depth;
            const radAngle = angle * Math.PI / 180 + windSwayForce;

            const endX = startX + Math.sin(radAngle) * len;
            const endY = startY - Math.cos(radAngle) * len;

            // Taper thickness based on depth
            ctx.lineWidth = Math.max(1, (maxDepth - depth) * 1.5);
            
            // Draw branch segment
            ctx.lineTo(endX, endY);
            
            // Branch styling (trunk has deep brown-gray, leaves are custom neon color)
            if (depth > maxDepth * 0.7) {
                const budTheme = config.leafColor || 'Biolume Teal';
                if (budTheme === 'Cherry Blossom') ctx.strokeStyle = '#ff007f';
                else if (budTheme === 'Biolume Teal') ctx.strokeStyle = '#00f0ff';
                else if (budTheme === 'Autumn Rust') ctx.strokeStyle = '#e06646';
                else ctx.strokeStyle = '#00ff66'; // Emerald Matrix
            } else {
                ctx.strokeStyle = `rgba(100, 116, 139, ${0.4 + (1 - depth / maxDepth) * 0.6})`;
            }
            
            ctx.stroke();

            // Terminal bounds
            if (depth >= maxDepth) return;

            // Recurse Left and Right branching
            drawBranch(endX, endY, len * 0.75, angle - angleDelta, depth + 1, maxDepth, angleDelta, wind);
            drawBranch(endX, endY, len * 0.75, angle + angleDelta, depth + 1, maxDepth, angleDelta, wind);
        }

        // --- Render Frame ---
        function drawTreeFrame() {
            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const depth = config.treeDepth || 8;
            const symmetryAngle = config.branchAngle || 28;
            const windStrength = config.windSway !== undefined ? config.windSway : 1.8;

            const baseLen = Math.min(canvas.width, canvas.height) * 0.22;

            // Draw single massive fractal tree from bottom center
            drawBranch(canvas.width / 2, canvas.height * 0.95, baseLen, 0, 1, depth, symmetryAngle, windStrength);

            // Animate wind looping
            requestAnimationFrame(drawTreeFrame);
        }

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
            },
            destroy: function() {
                // Cancel dynamic canvas render loop (since we call requestAnimationFrame,
                // we should make sure we can exit gracefully)
                drawTreeFrame = () => {}; // override renderer to do nothing and halt loop
                window.removeEventListener('resize', resize);
                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }
        };
    };
})();
