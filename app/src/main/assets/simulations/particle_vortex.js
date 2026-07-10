// --- 3D Particle Vortex (Black Hole) ---
(function() {
    let scene, camera, renderer, animationFrameId, points;
    let particleCount = 5000;
    let particlesData = [];

    window.initSimulation = function(container, config) {
        scene = new THREE.Scene();

        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(0, 50, 100);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        container.appendChild(renderer.domElement);

        // Add a glowing core mesh to represent the singularity
        const coreGeo = new THREE.SphereGeometry(3, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        const coreGlowGeo = new THREE.SphereGeometry(4.5, 32, 32);
        const coreGlowMat = new THREE.MeshBasicMaterial({
            color: 0xbd00ff,
            transparent: true,
            opacity: 0.4,
            side: THREE.BackSide
        });
        const coreGlow = new THREE.Mesh(coreGlowGeo, coreGlowMat);
        scene.add(coreGlow);

        function setupParticles() {
            if (points) scene.remove(points);

            const countStr = config.particleCount || '5000';
            particleCount = parseInt(countStr);

            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            particlesData = [];

            const colorTheme = config.vortexColor || 'Aura Purple';
            let baseColor = new THREE.Color(0xbd00ff); // Aura Purple
            if (colorTheme === 'Cyber Cyan') baseColor = new THREE.Color(0x00f0ff);
            else if (colorTheme === 'Infrared') baseColor = new THREE.Color(0xff3b30);
            else if (colorTheme === 'Gold Rush') baseColor = new THREE.Color(0xffd700);

            for (let i = 0; i < particleCount; i++) {
                // Spherical coordinates
                const radius = Math.random() * 80 + 5;
                const angle = Math.random() * Math.PI * 2;
                const y = (Math.random() - 0.5) * (80 - radius) * 0.2; // disc height

                positions[i * 3] = Math.cos(angle) * radius;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = Math.sin(angle) * radius;

                // Color gradients (brighter closer to the center)
                const c = baseColor.clone().multiplyScalar(0.3 + (1 - radius / 85) * 0.7);
                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;

                particlesData.push({
                    radius: radius,
                    angle: angle,
                    y: y,
                    speed: (0.01 + (1 - radius / 85) * 0.05)
                });
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.8,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            points = new THREE.Points(geometry, material);
            scene.add(points);
        }

        setupParticles();

        // --- Dragging Camera Rotation ---
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

            camera.position.x = camera.position.x * Math.cos(dx * 0.005) - camera.position.z * Math.sin(dx * 0.005);
            camera.position.z = camera.position.z * Math.cos(dx * 0.005) + camera.position.x * Math.sin(dx * 0.005);
            camera.position.y += dy * 0.2;
            camera.position.y = Math.max(10, Math.min(120, camera.position.y));
            camera.lookAt(0, 0, 0);

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

            const gravity = config.gravityStrength !== undefined ? config.gravityStrength : 1.2;
            const swirl = config.swirlSpeed !== undefined ? config.swirlSpeed : 1.5;

            const positions = points.geometry.attributes.position.array;

            for (let i = 0; i < particleCount; i++) {
                const data = particlesData[i];

                // Pull towards the center
                data.radius -= 0.05 * gravity * (1.5 - data.radius / 85);
                data.angle += data.speed * swirl;

                // Warp height based on spin velocity
                data.y = Math.sin(data.angle * 2) * (data.radius * 0.05);

                // Re-spawn far away if pulled into singularity
                if (data.radius < 3.5) {
                    data.radius = Math.random() * 20 + 60;
                    data.angle = Math.random() * Math.PI * 2;
                }

                positions[i * 3] = Math.cos(data.angle) * data.radius;
                positions[i * 3 + 1] = data.y;
                positions[i * 3 + 2] = Math.sin(data.angle) * data.radius;
            }

            points.geometry.attributes.position.needsUpdate = true;

            // Pulse center black hole
            const time = Date.now() * 0.002;
            coreGlow.scale.setScalar(1 + Math.sin(time) * 0.15);

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
                if (paramId === 'particleCount' || paramId === 'vortexColor') {
                    setupParticles();
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

                scene.traverse(object => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(m => m.dispose());
                        } else {
                            object.material.dispose();
                        }
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
