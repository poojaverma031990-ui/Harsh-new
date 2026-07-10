// --- Real-time ASCII Camera Matrix ---
(function() {
    let canvas, ctx, animationFrameId;
    let videoStream = null;
    let videoElement = null;
    let fallbackOffset = 0;

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

        // Try initializing local webcam feed
        function initCamera() {
            if (config.inputSource === 'Matrix Flow Fallback') {
                stopCamera();
                return;
            }

            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 160, height: 120 } })
                .then(stream => {
                    videoStream = stream;
                    videoElement = document.createElement('video');
                    videoElement.autoplay = true;
                    videoElement.playsInline = true;
                    videoElement.srcObject = stream;
                })
                .catch(err => {
                    console.warn("Camera blocked or missing. Loading Matrix cascade fallback loop.");
                    stopCamera();
                });
        }

        function stopCamera() {
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
                videoStream = null;
            }
            if (videoElement) {
                videoElement.remove();
                videoElement = null;
            }
        }

        initCamera();

        // Standard density character map
        const asciiChars = '@#S%?*+;:-. '.split('');

        // --- Render Frame ---
        function render() {
            animationFrameId = requestAnimationFrame(render);

            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const spacing = config.asciiDensity || 10;
            const contrast = config.contrast || 1.2;
            const tint = config.colorStyle || 'Phosphor Green';

            // Select display color
            let color = '#00ff66';
            if (tint === 'Phosphor Green') color = '#00ff66';
            else if (tint === 'Amber Retro') color = '#ffd700';
            else if (tint === 'Full Chromatic') color = ''; // dynamic color matching
            else color = '#ffffff';

            ctx.font = `${spacing}px monospace`;
            ctx.textAlign = 'center';

            // 1. If Camera Stream is active and loading frames
            if (videoElement && videoElement.readyState === videoElement.HAVE_CURRENT_DATA) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = Math.floor(canvas.width / spacing);
                tempCanvas.height = Math.floor(canvas.height / spacing);
                const tCtx = tempCanvas.getContext('2d');
                
                // Draw downsampled camera frame
                tCtx.translate(tempCanvas.width, 0);
                tCtx.scale(-1, 1); // mirror
                tCtx.drawImage(videoElement, 0, 0, tempCanvas.width, tempCanvas.height);

                const imgData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                const data = imgData.data;

                for (let y = 0; y < tempCanvas.height; y++) {
                    for (let x = 0; x < tempCanvas.width; x++) {
                        const idx = (y * tempCanvas.width + x) * 4;
                        const r = data[idx];
                        const g = data[idx+1];
                        const b = data[idx+2];

                        // Convert luma
                        let luma = (0.299*r + 0.587*g + 0.114*b) / 255;
                        luma = Math.pow(luma, contrast); // contrast adjustment

                        const charIdx = Math.floor(luma * (asciiChars.length - 1));
                        const symbol = asciiChars[charIdx];

                        if (tint === 'Full Chromatic') {
                            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                        } else {
                            ctx.fillStyle = color;
                        }

                        ctx.fillText(symbol, x * spacing + spacing/2, y * spacing + spacing);
                    }
                }
            } else {
                // 2. Fallback procedural matrix waveform grid
                fallbackOffset += 0.05;
                const cols = Math.floor(canvas.width / spacing);
                const rows = Math.floor(canvas.height / spacing);

                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        // Generate waves of sinusoidal light values
                        const waveVal = Math.sin(x * 0.1 + fallbackOffset) * Math.cos(y * 0.1 - fallbackOffset);
                        const intensity = (waveVal + 1) * 0.5;

                        const charIdx = Math.floor(intensity * (asciiChars.length - 1));
                        const symbol = asciiChars[charIdx];

                        ctx.fillStyle = tint === 'Full Chromatic' ? `hsla(${(x*10 + Date.now()/50)%360}, 95%, 60%, ${intensity})` : color;
                        ctx.fillText(symbol, x * spacing + spacing/2, y * spacing + spacing);
                    }
                }
            }
        }

        render();

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
                if (paramId === 'inputSource') {
                    initCamera();
                }
            },
            destroy: function() {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resize);
                stopCamera();
                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }
        };
    };
})();
