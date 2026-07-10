// --- HTML5 Audio Synthesizer & Visualizer ---
(function() {
    let canvas, ctx, animationFrameId;
    let audioCtx = null;
    let particles = [];

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

        // --- Web Audio Setup ---
        function initAudio() {
            if (audioCtx) return;
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
        }

        function playSynthTone(freq) {
            initAudio();
            if (!audioCtx) return;

            // Trigger synth oscillator nodes
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            osc.type = config.waveType || 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            // Filter resonance
            filter.type = 'lowpass';
            filter.Q.setValueAtTime(config.resonance || 4.0, audioCtx.currentTime);
            filter.frequency.setValueAtTime(1000 + Math.random() * 500, audioCtx.currentTime);

            // Gain envelope
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

            // Routing
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 1.2);
        }

        // --- Touch interaction triggers sound waves ---
        const onInteraction = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const mx = clientX - rect.left;
            const my = clientY - rect.top;

            // Map coordinates to frequency notes (200Hz to 1200Hz)
            const freq = 200 + (1 - my / canvas.height) * 1000;
            playSynthTone(freq);

            // Add visual concentric ripples
            particles.push({
                x: mx,
                y: my,
                radius: 1,
                maxRadius: Math.random() * 150 + 100,
                color: config.waveColor === 'Hot Pink Glow' ? '#ff007f' : config.waveColor === 'Matrix Volt' ? '#00ff66' : '#00f0ff',
                opacity: 1.0
            });
            if (particles.length > 30) particles.shift();
        };

        canvas.addEventListener('mousedown', onInteraction);
        canvas.addEventListener('touchstart', onInteraction);

        // --- Render Frame ---
        function render() {
            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Display guide instruction
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.font = '13px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('TOUCH/DRAG ANYWHERE TO SYNTHESIZE PITCH WAVES', canvas.width / 2, canvas.height * 0.5);

            ctx.lineWidth = 3;

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.radius += (p.maxRadius - p.radius) * 0.08;
                p.opacity -= 0.015;

                ctx.strokeStyle = p.color;
                ctx.globalAlpha = p.opacity;
                
                // Draw ripple rings
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.stroke();

                // Draw secondary harmonics rings
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2);
                ctx.stroke();
                ctx.lineWidth = 3; // reset

                if (p.opacity <= 0) {
                    particles.splice(i, 1);
                }
            }

            ctx.globalAlpha = 1.0;
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
                
                canvas.removeEventListener('mousedown', onInteraction);
                canvas.removeEventListener('touchstart', onInteraction);

                if (audioCtx) {
                    audioCtx.close();
                }

                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }
        };
    };
})();
