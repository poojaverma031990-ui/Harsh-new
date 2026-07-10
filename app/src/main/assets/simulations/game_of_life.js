// --- Conway's Game of Life (Neon 2D) ---
(function() {
    let canvas, ctx, animationFrameId;
    let grid = [];
    let cols, rows;
    let cellScale = 8;
    let lastTick = 0;
    let isDrawing = false;

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
            
            cellScale = config.gridScale || 8;
            cols = Math.floor(canvas.width / cellScale);
            rows = Math.floor(canvas.height / cellScale);
            
            initGrid();
        };

        function initGrid() {
            grid = [];
            for (let x = 0; x < cols; x++) {
                grid[x] = [];
                for (let y = 0; y < rows; y++) {
                    grid[x][y] = Math.random() > 0.85 ? 1 : 0; // Random seeding initially
                }
            }
        }

        resize();
        window.addEventListener('resize', resize);

        // --- Draw interactions ---
        const getGridCell = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const x = Math.floor((clientX - rect.left) / cellScale);
            const y = Math.floor((clientY - rect.top) / cellScale);
            return { x, y };
        };

        const onStart = (e) => {
            isDrawing = true;
            const cell = getGridCell(e);
            if (cell.x >= 0 && cell.x < cols && cell.y >= 0 && cell.y < rows) {
                grid[cell.x][cell.y] = grid[cell.x][cell.y] === 1 ? 0 : 1;
            }
        };

        const onMove = (e) => {
            if (!isDrawing) return;
            const cell = getGridCell(e);
            if (cell.x >= 0 && cell.x < cols && cell.y >= 0 && cell.y < rows) {
                grid[cell.x][cell.y] = 1;
            }
        };

        const onEnd = () => { isDrawing = false; };

        canvas.addEventListener('mousedown', onStart);
        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseup', onEnd);
        canvas.addEventListener('touchstart', onStart);
        canvas.addEventListener('touchmove', onMove);
        canvas.addEventListener('touchend', onEnd);

        // --- Standard Cellular Automata Step ---
        function stepLife() {
            const tempGrid = [];
            for (let x = 0; x < cols; x++) {
                tempGrid[x] = [];
                for (let y = 0; y < rows; y++) {
                    // Count neighbors with circular bounds
                    let neighbors = 0;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            if (i === 0 && j === 0) continue;
                            const nx = (x + i + cols) % cols;
                            const ny = (y + j + rows) % rows;
                            if (grid[nx][ny] === 1) neighbors++;
                        }
                    }

                    const ruleStr = config.birthRules || 'B3/S23 (Conway)';
                    const isAlive = grid[x][y] === 1;

                    if (ruleStr === 'B3/S23 (Conway)') {
                        if (isAlive && (neighbors < 2 || neighbors > 3)) tempGrid[x][y] = 0;
                        else if (!isAlive && neighbors === 3) tempGrid[x][y] = 1;
                        else tempGrid[x][y] = grid[x][y];
                    } else if (ruleStr === 'B36/S23 (HighLife)') {
                        if (isAlive && (neighbors < 2 || neighbors > 3)) tempGrid[x][y] = 0;
                        else if (!isAlive && (neighbors === 3 || neighbors === 6)) tempGrid[x][y] = 1;
                        else tempGrid[x][y] = grid[x][y];
                    } else if (ruleStr === 'B2/S') { // Seeds
                        if (!isAlive && neighbors === 2) tempGrid[x][y] = 1;
                        else tempGrid[x][y] = 0;
                    } else { // Maze-like
                        if (isAlive && (neighbors >= 1 && neighbors <= 5)) tempGrid[x][y] = 1;
                        else if (!isAlive && (neighbors === 3)) tempGrid[x][y] = 1;
                        else tempGrid[x][y] = 0;
                    }
                }
            }
            grid = tempGrid;
        }

        // --- Render Frame Loop ---
        function render(now) {
            animationFrameId = requestAnimationFrame(render);

            const tickRate = config.tickRate || 80;
            const cellColor = config.cellColor || 'Aurora Cyan';

            // Throttle stepping
            if (now - lastTick > tickRate) {
                stepLife();
                lastTick = now;
            }

            // Draw Grid cells
            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Select color token
            let color = '#00f0ff';
            if (cellColor === 'Aurora Cyan') color = '#00f0ff';
            else if (cellColor === 'Gold Bloom') color = '#ffd700';
            else if (cellColor === 'Hot Pink') color = '#ff007f';
            else color = `hsl(${(now / 30) % 360}, 90%, 60%)`;

            ctx.fillStyle = color;

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    if (grid[x][y] === 1) {
                        ctx.fillRect(x * cellScale + 1, y * cellScale + 1, cellScale - 1, cellScale - 1);
                    }
                }
            }
        }

        render(0);

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
                if (paramId === 'gridScale') {
                    resize();
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
