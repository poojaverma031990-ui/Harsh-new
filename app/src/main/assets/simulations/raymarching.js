// --- GPU Raymarching Terrain Sandbox ---
(function() {
    let renderer, glScene, glCamera, glMesh, glMaterial, animationFrameId;

    window.initSimulation = function(container, config) {
        // --- Setup WebGL Shader Environment ---
        glScene = new THREE.Scene();
        
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        glCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(1); // Set 1 to avoid lag in complex shaders
        container.appendChild(renderer.domElement);

        // --- Fragment Shader (Computes real-time infinite terrains) ---
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform float u_sunAngle;
            uniform float u_turbulence;
            uniform float u_detail;
            uniform vec3 u_paletteA;
            uniform vec3 u_paletteB;

            varying vec2 vUv;

            // Simple 2D Pseudo-Random Noise generator
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                           mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
            }

            // Fractional Brownian Motion for terrain valleys
            float fbm(vec2 p) {
                float v = 0.0;
                float a = 0.5;
                vec2 shift = vec2(100.0);
                // Rotate to reduce axial bias
                mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
                for (int i = 0; i < 5; ++i) {
                    v += a * noise(p);
                    p = rot * p * 2.0 + shift;
                    a *= 0.5;
                }
                return v;
            }

            // Distance Estimator Function
            float map(vec3 p) {
                float h = fbm(p.xz * 0.15) * 12.0 * u_turbulence;
                return p.y - h;
            }

            // Calculate surface normal coordinates
            vec3 getNormal(vec3 p) {
                vec2 eps = vec2(0.01, 0.0);
                return normalize(vec3(
                    map(p + eps.xyy) - map(p - eps.xyy),
                    map(p + eps.yxy) - map(p - eps.yxy),
                    map(p + eps.yyx) - map(p - eps.yyx)
                ));
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec2 p = -1.0 + 2.0 * uv;
                p.x *= u_resolution.x / u_resolution.y;

                // Set up Camera perspective vectors
                vec3 ro = vec3(u_time * 2.5, 9.0, u_time * 1.5); // Moving ray origin
                vec3 target = ro + vec3(1.0, -0.15, 1.0);
                vec3 ww = normalize(target - ro);
                vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
                vec3 vv = normalize(cross(uu, ww));
                vec3 rd = normalize(p.x * uu + p.y * vv + 1.2 * ww);

                // Raymarching Loop
                float d = 0.0;
                float maxD = 120.0;
                float t = 0.0;
                
                int maxIterations = 50;
                if (u_detail > 1.5) maxIterations = 80; // Cinematic detailed passes

                for (int i = 0; i < 80; i++) {
                    if (i > maxIterations) break;
                    vec3 pos = ro + rd * t;
                    d = map(pos);
                    if (d < 0.01 || t > maxD) break;
                    t += d * 0.45;
                }

                // Shading & Sky Background colouring
                vec3 color = vec3(0.0);
                
                // Sun placement coordinates
                float sunRad = u_sunAngle * 3.14159 / 180.0;
                vec3 sunDir = normalize(vec3(cos(sunRad), 0.5, sin(sunRad)));

                if (t < maxD) {
                    vec3 pos = ro + rd * t;
                    vec3 nor = getNormal(pos);

                    // Diffuse lighting
                    float diff = max(0.0, dot(nor, sunDir));
                    
                    // Simple ambient occlusion
                    float ao = clamp(1.0 - t / maxD, 0.0, 1.0);

                    // Mix procedural heights with custom palette gradients
                    vec3 baseColor = mix(u_paletteA, u_paletteB, clamp(pos.y * 0.08, 0.0, 1.0));
                    color = baseColor * (diff * 0.8 + 0.2) * ao;

                    // Apply fog
                    color = mix(color, vec3(0.03, 0.07, 0.12), 1.0 - exp(-0.002 * t * t));
                } else {
                    // Sky Dome
                    float skyGlow = max(0.0, dot(rd, sunDir));
                    color = vec3(0.03, 0.07, 0.12) + vec3(0.9, 0.4, 0.2) * pow(skyGlow, 8.0);
                }

                gl_FragColor = vec4(color, 1.0);
            }
        `;

        // Configure shared variables
        const uniforms = {
            u_resolution: { value: new THREE.Vector2(width, height) },
            u_time: { value: 0 },
            u_sunAngle: { value: 120 },
            u_turbulence: { value: 1.0 },
            u_detail: { value: 1.0 },
            u_paletteA: { value: new THREE.Color(0xff007f) },
            u_paletteB: { value: new THREE.Color(0x00f0ff) }
        };

        const geom = new THREE.PlaneGeometry(2, 2);
        glMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: uniforms
        });

        glMesh = new THREE.Mesh(geom, glMaterial);
        glScene.add(glMesh);

        function updatePalettes() {
            const palette = config.colorMap || 'Space Dust';
            if (palette === 'Space Dust') {
                uniforms.u_paletteA.value.setHex(0xff007f);
                uniforms.u_paletteB.value.setHex(0xbd00ff);
            } else if (palette === 'Neon Dunes') {
                uniforms.u_paletteA.value.setHex(0xffd700);
                uniforms.u_paletteB.value.setHex(0xff007f);
            } else { // Toxic Wastes
                uniforms.u_paletteA.value.setHex(0x00ff66);
                uniforms.u_paletteB.value.setHex(0x00f0ff);
            }

            const detail = config.viewDetail || 'Standard';
            uniforms.u_detail.value = detail === 'Cinematic' ? 2.0 : detail === 'Performance' ? 0.5 : 1.0;
        }

        updatePalettes();

        // --- Render Loop ---
        function animate() {
            animationFrameId = requestAnimationFrame(animate);

            uniforms.u_time.value = Date.now() * 0.00015;
            uniforms.u_sunAngle.value = config.sunAngle !== undefined ? config.sunAngle : 120;
            uniforms.u_turbulence.value = config.terrainTurbulence !== undefined ? config.terrainTurbulence : 1.0;

            renderer.render(glScene, glCamera);
        }

        animate();

        // --- Resize Event ---
        const resizeHandler = () => {
            const w = container.clientWidth || window.innerWidth;
            const h = container.clientHeight || window.innerHeight;
            renderer.setSize(w, h);
            uniforms.u_resolution.value.set(w, h);
        };
        window.addEventListener('resize', resizeHandler);

        // --- Register Controller Object ---
        window.currentSimulation = {
            onConfigChange: function(paramId, value) {
                config[paramId] = value;
                if (paramId === 'colorMap' || paramId === 'viewDetail') {
                    updatePalettes();
                }
            },
            destroy: function() {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resizeHandler);

                if (glMesh) {
                    glScene.remove(glMesh);
                    if (glMesh.geometry) glMesh.geometry.dispose();
                    if (glMesh.material) glMesh.material.dispose();
                }

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
