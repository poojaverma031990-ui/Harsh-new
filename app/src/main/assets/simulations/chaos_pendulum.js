// --- Chaos Theory Double Pendulum ---
(function() {
    let canvas, ctx, animationFrameId;
    let theta1 = Math.PI / 2;
    let theta2 = Math.PI / 2;
    let omega1 = 0;
    let omega2 = 0;
    
    let l1 = 120;
    let l2 = 120;
    let m1 = 10;
    let m2 = 10;

    let path = [];

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
            
            const size = Math.min(canvas.width, canvas.height);
            l1 = size * 0.18;
            l2 = size * 0.18;
        };

        resize();
        window.addEventListener('resize', resize);

        // Reset state
        theta1 = Math.PI / 2;
        theta2 = Math.PI / 2;
        omega1 = 0;
        omega2 = 0;
        path = [];

        // --- Render Loop ---
        function step() {
            // physics step
            const g = (config.gravity !== undefined ? config.gravity : 1.0) * 0.5;
            const mRatio = config.massRatio || 4.0;
            const lenRatio = config.lengthRatio || 1.0;

            const mass1 = m1 * mRatio;
            const mass2 = m2;

            const len1 = l1 * lenRatio;
            const len2 = l2 * lenRatio;

            // Solve double pendulum equations of motion (Euler method)
            const num1 = -g * (2 * mass1 + mass2) * Math.sin(theta1) - mass2 * g * Math.sin(theta1 - 2 * theta2) - 2 * Math.sin(theta1 - theta2) * mass2 * (omega2 * omega2 * len2 + omega1 * omega1 * len1 * Math.cos(theta1 - theta2));
            const den1 = len1 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * theta1 - 2 * theta2));
            const alpha1 = num1 / den1;

            const num2 = 2 * Math.sin(theta1 - theta2) * (omega1 * omega1 * len1 * (mass1 + mass2) + g * (mass1 + mass2) * Math.cos(theta1) + omega2 * omega2 * len2 * mass2 * Math.cos(theta1 - theta2));
            const den2 = len2 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * theta1 - 2 * theta2));
            const alpha2 = num2 / den2;

            omega1 += alpha1;
            omega2 += alpha2;
            theta1 += omega1;
            theta2 += omega2;

            // Damping friction
            omega1 *= 0.999;
            omega2 *= 0.999;

            // Bob coordinates
            const cx = canvas.width / 2;
            const cy = canvas.height * 0.4;

            const x1 = cx + len1 * Math.sin(theta1);
            const y1 = cy + len1 * Math.cos(theta1);

            const x2 = x1 + len2 * Math.sin(theta2);
            const y2 = y1 + len2 * Math.cos(theta2);

            // Record trails
            path.push({ x: x2, y: y2 });
            const trailLimit = config.trailLength || 120;
            if (path.length > trailLimit) {
                path.shift();
            }

            // Draw frame
            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Render chaotic lines
            if (path.length > 1) {
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                for (let i = 1; i < path.length; i++) {
                    ctx.lineTo(path[i].x, path[i].y);
                }
                ctx.strokeStyle = '#bd00ff';
                ctx.shadowColor = '#bd00ff';
                ctx.shadowBlur = 6;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.shadowBlur = 0; // reset
            }

            // Render double pendulum rods
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Render pivot and bob weights
            ctx.fillStyle = '#00f0ff';
            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x1, y1, 8 + mass1 * 0.1, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ff007f';
            ctx.beginPath();
            ctx.arc(x2, y2, 8 + mass2 * 0.1, 0, Math.PI * 2);
            ctx.fill();

            animationFrameId = requestAnimationFrame(step);
        }

        step();

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
                if (paramId === 'trailLength') {
                    path = [];
                }
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
