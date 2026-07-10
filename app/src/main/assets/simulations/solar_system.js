// --- Visual-Enhanced 3D WebGL Solar System ---
(function() {
    let scene, camera, renderer, controls, animationFrameId;
    let sun, sunGlow, starField;
    let planets = [];

    window.initSimulation = function(container, config) {
        // --- Scene Setup ---
        scene = new THREE.Scene();
        
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(0, 45, 75);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);

        // --- Controls ---
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxDistance = 200;
        controls.minDistance = 10;

        // --- Ambient Lighting ---
        const ambientLight = new THREE.AmbientLight(0x555555);
        scene.add(ambientLight);

        // --- The Sun ---
        const sunLight = new THREE.PointLight(0xffffff, 2.5, 400);
        scene.add(sunLight);

        const sunGeo = new THREE.SphereGeometry(7, 32, 32);
        const sunMat = new THREE.MeshBasicMaterial({
            color: 0xff4500, // Deep orange-red
            wireframe: false
        });
        sun = new THREE.Mesh(sunGeo, sunMat);
        scene.add(sun);

        // Sun Glow
        const sunGlowGeo = new THREE.SphereGeometry(7.6, 32, 32);
        const sunGlowMat = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
        sun.add(sunGlow);

        // --- Starfield Background ---
        const starsGeo = new THREE.BufferGeometry();
        const starsCount = 8000;
        const starPositions = new Float32Array(starsCount * 3);

        for(let i = 0; i < starsCount * 3; i++) {
            starPositions[i] = (Math.random() - 0.5) * 600;
        }
        starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6, transparent: true, opacity: 0.9 });
        starField = new THREE.Points(starsGeo, starsMat);
        scene.add(starField);

        // --- Helper function to create planets ---
        function createPlanet(radius, color, orbitRadius, speed, hasRings = false, isJupiter = false) {
            const planetGroup = new THREE.Group();
            scene.add(planetGroup);

            // Orbit Line
            const orbitGeo = new THREE.RingGeometry(orbitRadius - 0.15, orbitRadius + 0.15, 128);
            const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
            const orbit = new THREE.Mesh(orbitGeo, orbitMat);
            orbit.rotation.x = Math.PI / 2;
            scene.add(orbit);

            // Planet Mesh
            const planetGeo = new THREE.SphereGeometry(radius, 32, 32);
            let planetMat;

            if (isJupiter) {
                planetMat = new THREE.MeshStandardMaterial({
                    color: color,
                    roughness: 0.6,
                    bumpScale: 0.05,
                    flatShading: true // Gives striped look
                });
            } else {
                planetMat = new THREE.MeshStandardMaterial({
                    color: color,
                    roughness: 0.5,
                    metalness: 0.1
                });
            }

            const planetMesh = new THREE.Mesh(planetGeo, planetMat);
            planetMesh.position.x = orbitRadius;
            planetGroup.add(planetMesh);

            // Saturn Rings
            let ring = null;
            if (hasRings) {
                const ringGeo = new THREE.RingGeometry(radius + 1.2, radius + 4, 64);
                const ringMat = new THREE.MeshStandardMaterial({ 
                    color: 0xd4c3a3, 
                    side: THREE.DoubleSide, 
                    transparent: true, 
                    opacity: 0.7 
                });
                ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = Math.PI / 3; // PERFECT visual angle
                planetMesh.add(ring);
            }

            return { 
                group: planetGroup, 
                mesh: planetMesh, 
                orbit,
                ring,
                baseRadius: radius,
                baseOrbit: orbitRadius,
                speed: speed 
            };
        }

        // --- Generate All 8 Planets ---
        planets = [
            createPlanet(1.0, 0x8a7d73, 14, 0.025),  // Mercury
            createPlanet(1.6, 0xd97724, 20, 0.018),  // Venus
            createPlanet(1.8, 0x4ba3e3, 28, 0.015),  // Earth
            createPlanet(1.3, 0xe06646, 36, 0.012),  // Mars
            createPlanet(3.8, 0xb05b2e, 48, 0.008, false, true), // Jupiter
            createPlanet(2.8, 0xe2bf7d, 62, 0.006, true),  // Saturn
            createPlanet(2.0, 0x7ca1a6, 74, 0.004),  // Uranus
            createPlanet(1.9, 0x4b70dd, 84, 0.003)   // Neptune
        ];

        // --- Animation Engine ---
        function animate() {
            animationFrameId = requestAnimationFrame(animate);

            // Fetch dynamic parameters
            const orbitSpeedMult = config.orbitSpeed !== undefined ? config.orbitSpeed : 0.8;
            const axialSpeedMult = config.rotationSpeed !== undefined ? config.rotationSpeed : 1.0;
            const glowMult = config.sunGlow !== undefined ? config.sunGlow : 1.0;
            const sizeMult = config.planetScale !== undefined ? config.planetScale : 1.0;

            // Sun Rotation & Dynamic Glow Pulse
            sun.rotation.y += 0.002 * axialSpeedMult;
            const time = Date.now() * 0.001;
            sunGlow.scale.setScalar((7.6 / 7) * (1 + Math.sin(time * 1.5) * 0.02 * glowMult));

            // Planets Rotation and Orbit Movement
            planets.forEach(p => {
                p.group.rotation.y += p.speed * 0.2 * orbitSpeedMult; // orbital speed
                p.mesh.rotation.y += 0.01 * axialSpeedMult;           // axial spin
                p.mesh.scale.setScalar(sizeMult);
            });

            controls.update();
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
            },
            destroy: function() {
                // Cancel rendering frame
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resizeHandler);

                // Dispose of OrbitControls
                if (controls) controls.dispose();

                // Recursively dispose of Three.js objects
                scene.traverse(object => {
                    if (!object.isMesh && !object.isPoints) return;
                    if (object.geometry) object.geometry.dispose();

                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(mat => mat.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });

                // Dispose of renderer
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
