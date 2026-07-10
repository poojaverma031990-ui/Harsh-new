// --- Matrix Digital Rain ---
(function() {
    let canvas, ctx, animationFrameId;
    let columns = [];
    let characters = [];

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
            
            const fontSize = config.fontSize || 14;
            const colsCount = Math.floor(canvas.width / fontSize) + 1;
            
            columns = [];
            for (let i = 0; i < colsCount; i++) {
                columns.push({
                    y: Math.random() * -100 - 20,
                    speed: Math.random() * 0.5 + 0.5
                });
            }
        };

        resize();
        window.addEventListener('resize', resize);

        // Character lists based on selector config
        const getCharSet = () => {
            const set = config.charSet || 'Binary';
            if (set === 'Binary') return '01'.split('');
            if (set === 'Katakana') return 'アカサタナハマヤラワガザダバパイウエオキクケコシスセソ'.split('');
            if (set === 'Norse Runes') return 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛗᛚᛜᛞᛟ'.split('');
            return 'αβγδεζηθικλμνξοπρστυφχψω0123456789X'.split(''); // Alien Hex
        };

        const getThemeColor = (brightness) => {
            const theme = config.themeColor || 'Classic Green';
            if (theme === 'Classic Green') return `rgba(0, 255, 102, ${brightness})`;
            if (theme === 'Binary Red') return `rgba(255, 59, 48, ${brightness})`;
            if (theme === 'Deus Blue') return `rgba(0, 240, 255, ${brightness})`;
            
            // Multi-Code (color shifts over horizontal gradient)
            return `hsla(${(Date.now() / 100) % 360}, 95%, 60%, ${brightness})`;
        };

        // --- Render Loop ---
        function draw() {
            // Apply slight alpha backdrop to create trailing persistence
            ctx.fillStyle = 'rgba(3, 7, 18, 0.06)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const fontSize = config.fontSize || 14;
            ctx.font = `${fontSize}px monospace`;
            ctx.textAlign = 'center';

            const charList = getCharSet();
            const cascadeSpeed = config.dropSpeed || 18;

            for (let i = 0; i < columns.length; i++) {
                const col = columns[i];
                const char = charList[Math.floor(Math.random() * charList.length)];
                
                const x = i * fontSize;
                const y = col.y * fontSize;

                // Glowing leader symbol
                ctx.fillStyle = '#ffffff';
                ctx.fillText(char, x, y);

                // Normal falling streams
                for (let j = 1; j < 12; j++) {
                    const trailY = y - j * fontSize;
                    if (trailY > 0 && trailY < canvas.height) {
                        ctx.fillStyle = getThemeColor(1 - j / 12);
                        const trailChar = charList[Math.floor(Math.random() * charList.length)];
                        ctx.fillText(trailChar, x, trailY);
                    }
                }

                // Increment position
                col.y += (cascadeSpeed * 0.02) * col.speed;

                // Respawn column
                if (y > canvas.height + 200 && Math.random() > 0.98) {
                    col.y = Math.random() * -10 - 5;
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        }

        draw();

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
                if (paramId === 'fontSize') {
                    resize();
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
