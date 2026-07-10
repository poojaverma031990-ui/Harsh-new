// --- 3D WebGL Rubik's Cube Sandbox ---
(function() {
    let scene, camera, renderer, animationFrameId, cubeGroup;
    let cubies = [];

    window.initSimulation = function(container, config) {
        scene = new THREE.Scene();
        
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(6, 6, 12);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const dLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        dLight1.position.set(10, 15, 10);
        scene.add(dLight1);

        const dLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
        dLight2.position.set(-10, -10, -10);
        scene.add(dLight2);

        cubeGroup = new THREE.Group();
        scene.add(cubeGroup);

        // Face colors
        const colors = [
            0xff0000, // Right: Red
            0xff8c00, // Left: Orange
            0xffffff, // Top: White
            0xffd700, // Bottom: Yellow
            0x00f0ff, // Front: Cyan
            0x00ff66  // Back: Green
        ];

        function createCube() {
            // Remove previous cubies
            cubies.forEach(c => cubeGroup.remove(c));
            cubies = [];

            const dimensions = config.cubeDimensions || '3x3x3';
            const size = dimensions === '3x3x3' ? 3 : 2;

            const spacing = 1.05;
            const offset = (size - 1) / 2;

            for (let x = 0; x < size; x++) {
                for (let y = 0; y < size; y++) {
                    for (let z = 0; z < size; z++) {
                        // Skip rendering core inner blocks for 3x3x3
                        if (size === 3 && x === 1 && y === 1 && z === 1) continue;

                        const materials = colors.map(c => new THREE.MeshLambertMaterial({ color: c }));
                        
                        // Core cubie box geometry
                        const geo = new THREE.BoxGeometry(0.95, 0.95, 0.95);
                        const cubie = new THREE.Mesh(geo, materials);

                        // Position cubies
                        cubie.position.set(
                            (x - offset) * spacing,
                            (y - offset) * spacing,
                            (z - offset) * spacing
                        );

                        cubeGroup.add(cubie);
                        cubies.push(cubie);
                    }
                }
            }
        }

        createCube();

        // Dragging Rotations
        let isDragging = false;
        let prevMouseX = 0, prevMouseY = 0;

        const onStart = (e) => {
            isDragging = true;
            prevMouseX = e.touches ? e.touches[0].clientX : e.clientX;
            prevMouseY = e.touches ? e.touches[0].clientY : e.clientY;
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const mx = e.touches ? e.touches[0].clientX : e.clientX;
            const my = e.touches ? e.touches[0].clientY : e.clientY;
            const dx = mx - prevMouseX;
            const dy = my - prevMouseY;

            cubeGroup.rotation.y += dx * 0.01;
            cubeGroup.rotation.x += dy * 0.01;

            prevMouseX = mx;
            prevMouseY = my;
        };

        const onEnd = () => { isDragging = false; };

        container.addEventListener('mousedown', onStart);
        container.addEventListener('mousemove', onMove);
        container.addEventListener('mouseup', onEnd);
        container.addEventListener('touchstart', onStart);
        container.addEventListener('touchmove', onMove);
        container.addEventListener('touchend', onEnd);

        // --- Render Loop ---
        function animate() {
            animationFrameId = requestAnimationFrame(animate);

            const speed = config.twistSpeed || 0.8;

            // Slow idle self-rotation unless user is dragging
            if (!isDragging) {
                cubeGroup.rotation.y += 0.003 * speed;
            }

            renderer.render(scene, camera);
        }

        animate();

        // --- Resize Event ---
        const resizeHandler = () => {
            const w = container.clientWidth || window.innerWidth;
            const h = container.clientHeight || window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', resizeHandler);

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
                if (paramId === 'cubeDimensions') {
                    createCube();
                }
            },
            destroy: function() {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resizeHandler);

                container.removeEventListener('mousedown', onStart);
                container.removeEventListener('mousemove', onMove);
                container.removeEventListener('mouseup', onEnd);
                container.removeEventListener('touchstart', onStart);
                container.removeEventListener('touchmove', onMove);
                container.removeEventListener('touchend', onEnd);

                cubies.forEach(c => {
                    if (c.geometry) c.geometry.dispose();
                    if (Array.isArray(c.material)) {
                        c.material.forEach(m => m.dispose());
                    } else if (c.material) {
                        c.material.dispose();
                    }
                });

                if (renderer) {
                    renderer.dispose();
                    if (renderer.domElement && renderer.domElement.parentNode) {
                        renderer.domElement.parentNode.removeChild(renderer.domElement);
                    }
                }
            }
        };
    };
})();
