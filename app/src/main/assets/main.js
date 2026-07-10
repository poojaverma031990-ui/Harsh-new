// --- Simulation Registry (All 21 Premium Modules) ---
const PLAYGROUND_REGISTRY = [
    {
        id: 'solar_system',
        title: '3D WebGL Solar System',
        category: '3d',
        icon: 'fa-solid fa-globe',
        glow: 'neon-blue',
        desc: 'WebGL 3D planetary physics featuring OrbitControls, Saturn rings, starfield backgrounds, and Jupiter stripes.',
        info: 'Utilizes Keplerian orbits around a common gravitational barycenter. Planets rotate on axes and speed scales with distance.',
        params: [
            { id: 'orbitSpeed', label: 'Orbit Speed', type: 'slider', min: 0, max: 2, step: 0.1, val: 0.8 },
            { id: 'rotationSpeed', label: 'Planet Spin', type: 'slider', min: 0, max: 2, step: 0.1, val: 1.0 },
            { id: 'sunGlow', label: 'Sun Glow Pulse', type: 'slider', min: 0.1, max: 3, step: 0.1, val: 1.0 },
            { id: 'planetScale', label: 'Planet ScaleMultiplier', type: 'slider', min: 0.5, max: 2.5, step: 0.1, val: 1.0 }
        ]
    },
    {
        id: 'fluid_dynamics',
        title: 'Fluid Dynamics Sandbox',
        category: 'physics',
        icon: 'fa-solid fa-wind',
        glow: 'neon-green',
        desc: 'Interactive smoke/liquid physics field. Swipe and click to inject high-density flow trails.',
        info: 'Simulates fluid dynamics using an advection-diffusion solver over a grid vector field. Blends particle trails using additive blending.',
        params: [
            { id: 'viscosity', label: 'Viscosity', type: 'slider', min: 0.1, max: 2, step: 0.1, val: 0.5 },
            { id: 'fadeSpeed', label: 'Smoke Dissipation', type: 'slider', min: 0.92, max: 0.99, step: 0.01, val: 0.96 },
            { id: 'colorTheme', label: 'Color Space', type: 'select', options: ['Rainbow', 'Cosmic Neon', 'Emerald', 'Solar Flare'], val: 'Rainbow' },
            { id: 'injectionSize', label: 'Brush Radius', type: 'slider', min: 5, max: 50, step: 2, val: 20 }
        ]
    },
    {
        id: 'particle_vortex',
        title: '3D Particle Vortex',
        category: '3d',
        icon: 'fa-solid fa-hurricane',
        glow: 'neon-purple',
        desc: 'Thousands of particles revolving around a central hyper-gravitational accretion disk.',
        info: 'Simulates gravitational attraction towards a black hole singularity in 3D space with frictional drag and centrifugal forces.',
        params: [
            { id: 'particleCount', label: 'Particles', type: 'select', options: ['1000', '2500', '5000', '10000'], val: '5000' },
            { id: 'gravityStrength', label: 'Pull Strength', type: 'slider', min: 0.1, max: 3.0, step: 0.1, val: 1.2 },
            { id: 'swirlSpeed', label: 'Swirl Velocity', type: 'slider', min: 0.1, max: 4.0, step: 0.1, val: 1.5 },
            { id: 'vortexColor', label: 'Accretion Tint', type: 'select', options: ['Aura Purple', 'Cyber Cyan', 'Infrared', 'Gold Rush'], val: 'Aura Purple' }
        ]
    },
    {
        id: 'matrix_rain',
        title: 'Matrix Digital Rain',
        category: 'generative',
        icon: 'fa-solid fa-code',
        glow: 'neon-green',
        desc: 'Endless vertical code rain cascades. Fully customizable speed, spacing, font sizes, and characters.',
        info: 'Generates parallel font streams utilizing custom alphabet characters with random velocity offsets and tail fading.',
        params: [
            { id: 'dropSpeed', label: 'Cascade Speed', type: 'slider', min: 5, max: 40, step: 1, val: 18 },
            { id: 'fontSize', label: 'Font Size', type: 'slider', min: 8, max: 28, step: 1, val: 14 },
            { id: 'themeColor', label: 'Glyph Color', type: 'select', options: ['Classic Green', 'Binary Red', 'Deus Blue', 'Multi-Code'], val: 'Classic Green' },
            { id: 'charSet', label: 'Language Core', type: 'select', options: ['Binary', 'Katakana', 'Norse Runes', 'Alien Hex'], val: 'Binary' }
        ]
    },
    {
        id: 'synthwave',
        title: 'Cyberpunk Synthwave',
        category: '3d',
        icon: 'fa-solid fa-guitar',
        glow: 'neon-pink',
        desc: 'A gorgeous 3D retro wireframe grid sliding past a massive glowing synth sun.',
        info: 'Uses sine and cosine height-deformation waves over a grid geometry, mapped via 3D projection matrix techniques.',
        params: [
            { id: 'driveSpeed', label: 'Speed Velocity', type: 'slider', min: 0.1, max: 3.0, step: 0.1, val: 1.0 },
            { id: 'waveAmplitude', label: 'Grid Turbulence', type: 'slider', min: 0.5, max: 10, step: 0.5, val: 4.0 },
            { id: 'sunSize', label: 'Sun Magnitude', type: 'slider', min: 20, max: 120, step: 5, val: 60 },
            { id: 'colorCycle', label: 'Glow Hue', type: 'select', options: ['Retro Magenta', 'Deep Cyan', 'Acid Yellow', 'Crimson Outlaw'], val: 'Retro Magenta' }
        ]
    },
    {
        id: 'chaos_pendulum',
        title: 'Chaos Double Pendulum',
        category: 'physics',
        icon: 'fa-solid fa-arrows-spin',
        glow: 'neon-purple',
        desc: 'Double pendulum physics tracing beautiful, hyper-chaotic paths.',
        info: 'Solves the Lagrange equations of motion for a double pendulum. Small initial variations yield exponentially divergent trail maps.',
        params: [
            { id: 'gravity', label: 'Gravity Force', type: 'slider', min: 0.1, max: 3.0, step: 0.1, val: 1.0 },
            { id: 'massRatio', label: 'Mass Balance', type: 'slider', min: 1, max: 10, step: 0.5, val: 4.0 },
            { id: 'lengthRatio', label: 'Arm Lengths', type: 'slider', min: 0.5, max: 2.0, step: 0.1, val: 1.0 },
            { id: 'trailLength', label: 'Trace Trails', type: 'slider', min: 10, max: 200, step: 10, val: 120 }
        ]
    },
    {
        id: 'game_of_life',
        title: "Conway's Game of Life",
        category: 'generative',
        icon: 'fa-solid fa-table-cells',
        glow: 'neon-blue',
        desc: 'Fascinating cellular automata life grids. Tap to draw cells, change rules, and run presets.',
        info: 'Applies discrete local rule matrices (B3/S23 standard) to cell grids. Shows neon trails for dying cells.',
        params: [
            { id: 'tickRate', label: 'Refresh Speed', type: 'slider', min: 10, max: 250, step: 10, val: 80 },
            { id: 'cellColor', label: 'Cell Color', type: 'select', options: ['Aurora Cyan', 'Gold Bloom', 'Hot Pink', 'RGB Cycle'], val: 'Aurora Cyan' },
            { id: 'birthRules', label: 'Spawn Rules', type: 'select', options: ['B3/S23 (Conway)', 'B36/S23 (HighLife)', 'B2/S', 'B135/S135'], val: 'B3/S23 (Conway)' },
            { id: 'gridScale', label: 'Cell Resolution', type: 'slider', min: 4, max: 16, step: 1, val: 8 }
        ]
    },
    {
        id: 'cloth_physics',
        title: 'Cloth Physics Grid',
        category: 'physics',
        icon: 'fa-solid fa-chess-board',
        glow: 'neon-green',
        desc: 'Interactive mass-spring mesh. Tweak wind, drag with mouse, or swipe to rip the threads.',
        info: 'Implements Verlet integration over nodes bound by structural, shear, and bending spring constraints.',
        params: [
            { id: 'windStrength', label: 'Wind Turbulence', type: 'slider', min: 0, max: 5.0, step: 0.2, val: 1.2 },
            { id: 'gravity', label: 'Weight Load', type: 'slider', min: 0.1, max: 3.0, step: 0.1, val: 1.0 },
            { id: 'structuralStiffness', label: 'Tension', type: 'slider', min: 1, max: 15, step: 1, val: 8 },
            { id: 'renderStyle', label: 'Visual Model', type: 'select', options: ['Neon Wireframe', 'Shaded Grid', 'Node Clusters'], val: 'Neon Wireframe' }
        ]
    },
    {
        id: 'fractal_tree',
        title: 'Fractal Tree Sandbox',
        category: 'generative',
        icon: 'fa-solid fa-tree',
        glow: 'neon-green',
        desc: 'Procedural branching forest. Real-time sinusoidal wind sways trunks and branches.',
        info: 'Draws self-similar recursion trees on canvas. Wind affects angle modifiers progressively per depth level.',
        params: [
            { id: 'treeDepth', label: 'Fractal Depth', type: 'slider', min: 4, max: 12, step: 1, val: 8 },
            { id: 'branchAngle', label: 'Symmetry Angle', type: 'slider', min: 10, max: 90, step: 1, val: 28 },
            { id: 'windSway', label: 'Wind Blow', type: 'slider', min: 0, max: 5, step: 0.2, val: 1.8 },
            { id: 'leafColor', label: 'Bud Color', type: 'select', options: ['Cherry Blossom', 'Biolume Teal', 'Autumn Rust', 'Emerald Matrix'], val: 'Biolume Teal' }
        ]
    },
    {
        id: 'sound_synth',
        title: 'Waveform Synthesizer',
        category: 'physics',
        icon: 'fa-solid fa-volume-high',
        glow: 'neon-purple',
        desc: 'Dynamic synthesizer playing pitch waveforms and generating massive visual frequency circles.',
        info: 'Constructs Web Audio oscillators based on touch coordinates. Tracks sound energy into particle shockwaves.',
        params: [
            { id: 'waveType', label: 'Oscillator Node', type: 'select', options: ['sine', 'square', 'sawtooth', 'triangle'], val: 'sine' },
            { id: 'resonance', label: 'Harmonics Q', type: 'slider', min: 1, max: 12, step: 0.5, val: 4.0 },
            { id: 'echoDelay', label: 'Feedback Delay', type: 'slider', min: 0, max: 1, step: 0.05, val: 0.3 },
            { id: 'waveColor', label: 'Sound Aura', type: 'select', options: ['Electro Indigo', 'Hot Pink Glow', 'Matrix Volt'], val: 'Electro Indigo' }
        ]
    },
    {
        id: 'soft_body',
        title: 'Soft Body Squishy Blob',
        category: 'physics',
        icon: 'fa-solid fa-cookie',
        glow: 'neon-pink',
        desc: 'Bouncy, squishy jelly blobs. Drop shapes, tweak mass spring stiffness, and pull them with gravity.',
        info: 'Implements center-mass pressure physics with perimeter springs to resolve dynamic deformation against solid bounds.',
        params: [
            { id: 'stiffness', label: 'Jelly Stiffness', type: 'slider', min: 1, max: 15, step: 0.5, val: 6.0 },
            { id: 'internalPressure', label: 'Pressure Level', type: 'slider', min: 0.5, max: 5.0, step: 0.1, val: 2.2 },
            { id: 'blobGravity', label: 'Blob Weight', type: 'slider', min: 0.1, max: 3.0, step: 0.1, val: 1.2 },
            { id: 'shapeType', label: 'Symmetry Model', type: 'select', options: ['Octagon Star', 'Blob Ring', 'Spike Gear'], val: 'Octagon Star' }
        ]
    },
    {
        id: 'kaleidoscope',
        title: 'Sacred Kaleidoscope',
        category: 'generative',
        icon: 'fa-solid fa-sun',
        glow: 'neon-blue',
        desc: 'Fascinating sacred geometry mirror painter. Tap/drag to brush glowing trails.',
        info: 'Applies rotational symmetry matrices onto planar canvases. Cycles particle colors dynamically over HSL grids.',
        params: [
            { id: 'mirrorSymmetry', label: 'Mirror Planes', type: 'slider', min: 4, max: 24, step: 1, val: 12 },
            { id: 'brushSize', label: 'Pen Radius', type: 'slider', min: 2, max: 20, step: 1, val: 6 },
            { id: 'glowIntensity', label: 'Aura Depth', type: 'slider', min: 5, max: 30, step: 1, val: 15 },
            { id: 'hueCycle', label: 'RGB Fade Cycle', type: 'slider', min: 1, max: 10, step: 1, val: 4 }
        ]
    },
    {
        id: 'creature_ik',
        title: 'IK Procedural Creature',
        category: 'generative',
        icon: 'fa-solid fa-spider',
        glow: 'neon-purple',
        desc: 'Multi-legged robot creature following user cursor smoothly via Inverse Kinematics.',
        info: 'Evaluates trigonometric joint angles using Forward-and-Backward Inverse Kinematics (FABRIK) algorithms.',
        params: [
            { id: 'legCount', label: 'Tentacles', type: 'slider', min: 3, max: 12, step: 1, val: 6 },
            { id: 'jointFlexibility', label: 'Muscle Springiness', type: 'slider', min: 0.2, max: 2.0, step: 0.1, val: 1.0 },
            { id: 'skinStyle', label: 'Chassis Hull', type: 'select', options: ['Glowing Armor', 'Luminous Bones', 'Ghost String'], val: 'Glowing Armor' },
            { id: 'moveSpeed', label: 'Reflex Speed', type: 'slider', min: 0.05, max: 0.4, step: 0.01, val: 0.15 }
        ]
    },
    {
        id: 'raymarching',
        title: 'Raymarching Terrain',
        category: '3d',
        icon: 'fa-solid fa-mountain',
        glow: 'neon-pink',
        desc: 'Endless procedurally generated 3D hills rendered with raymarching shaders in real-time.',
        info: 'Compiles a custom fragment shader that shoots vision vectors through distance field estimations of Fractal Brownian noise.',
        params: [
            { id: 'viewDetail', label: 'Ray Resolution', type: 'select', options: ['Standard', 'Performance', 'Cinematic'], val: 'Standard' },
            { id: 'sunAngle', label: 'Time of Day', type: 'slider', min: 0, max: 360, step: 10, val: 120 },
            { id: 'terrainTurbulence', label: 'Mountain Height', type: 'slider', min: 0.2, max: 2.5, step: 0.1, val: 1.0 },
            { id: 'colorMap', label: 'Palettes', type: 'select', options: ['Space Dust', 'Neon Dunes', 'Toxic Wastes'], val: 'Space Dust' }
        ]
    },
    {
        id: 'fireworks',
        title: 'Fireworks Particle Lab',
        category: 'physics',
        icon: 'fa-solid fa-fireworks',
        glow: 'neon-pink',
        desc: 'Custom gravity, wind, and particle counts for huge exploding fireworks.',
        info: 'Propagates gravity vectors on hundreds of expanding particles. Friction dampens and fades alpha scales progressively.',
        params: [
            { id: 'fireworkShellSize', label: 'Shell Size', type: 'slider', min: 50, max: 250, step: 10, val: 150 },
            { id: 'gravity', label: 'Debris Gravity', type: 'slider', min: 0.05, max: 0.6, step: 0.05, val: 0.2 },
            { id: 'sparksWind', label: 'Horizontal Wind', type: 'slider', min: -0.5, max: 0.5, step: 0.05, val: 0.0 },
            { id: 'sparksCount', label: 'Burst Spark Count', type: 'slider', min: 50, max: 300, step: 10, val: 120 }
        ]
    },
    {
        id: 'boids',
        title: 'Boids Flocking Sandbox',
        category: 'physics',
        icon: 'fa-solid fa-dove',
        glow: 'neon-green',
        desc: 'Stunning flocks of glowing agents demonstrating bird/fish crowd physics.',
        info: 'Evaluates sum of three kinematic rules: Separation, Cohesion, and Alignment. Boids track cursor targets.',
        params: [
            { id: 'boidsCount', label: 'Agent Population', type: 'slider', min: 30, max: 300, step: 10, val: 100 },
            { id: 'separationForce', label: 'Separation Pull', type: 'slider', min: 0.5, max: 3.0, step: 0.1, val: 1.5 },
            { id: 'alignmentForce', label: 'Alignment Sync', type: 'slider', min: 0.5, max: 3.0, step: 0.1, val: 1.0 },
            { id: 'cohesionForce', label: 'Cohesion Grouping', type: 'slider', min: 0.5, max: 3.0, step: 0.1, val: 1.0 }
        ]
    },
    {
        id: 'magnetic',
        title: 'Magnetic Field filings',
        category: 'physics',
        icon: 'fa-solid fa-magnet',
        glow: 'neon-blue',
        desc: 'Move magnets on-screen. Hundreds of iron needles align immediately to vectors.',
        info: 'Resolves magnetic dipole fields using Biot-Savart vector approximations. Needles align dynamically along field tangents.',
        params: [
            { id: 'needlesDensity', label: 'Iron Dust Count', type: 'slider', min: 100, max: 800, step: 50, val: 400 },
            { id: 'poleStrength', label: 'Magnet Strength', type: 'slider', min: 5, max: 30, step: 1, val: 15 },
            { id: 'magnetCount', label: 'Draggable Monopoles', type: 'slider', min: 1, max: 4, step: 1, val: 2 },
            { id: 'visualCore', label: 'Vector Visuals', type: 'select', options: ['Iron Needles', 'Flow Particles', 'Force Heatmap'], val: 'Iron Needles' }
        ]
    },
    {
        id: 'ascii_camera',
        title: 'ASCII Camera Matrix',
        category: 'generative',
        icon: 'fa-solid fa-camera',
        glow: 'neon-green',
        desc: 'Renders device camera frame or local fallback scenes in real-time animated ASCII letters.',
        info: 'Maps raw frame luma coefficients into custom letter density sequences. Computes grid offsets using canvas buffers.',
        params: [
            { id: 'asciiDensity', label: 'Symbol Spacing', type: 'slider', min: 6, max: 16, step: 1, val: 10 },
            { id: 'contrast', label: 'Image Contrast', type: 'slider', min: 0.5, max: 2.5, step: 0.1, val: 1.2 },
            { id: 'colorStyle', label: 'ASCII Tint', type: 'select', options: ['Phosphor Green', 'Amber Retro', 'Full Chromatic', 'Noir'], val: 'Phosphor Green' },
            { id: 'inputSource', label: 'Camera Input', type: 'select', options: ['Active Webcam', 'Matrix Flow Fallback'], val: 'Active Webcam' }
        ]
    },
    {
        id: 'rubiks_cube',
        title: "3D Rubik's Sandbox",
        category: '3d',
        icon: 'fa-solid fa-cube',
        glow: 'neon-purple',
        desc: 'Fully playable 3D Rubik\'s Cube. Shuffle and watch automatic solving steps.',
        info: 'Handles layer rotation groups in Three.js around local pivot vectors. Integrates scramble, solving, and orbital camera layers.',
        params: [
            { id: 'cubeDimensions', label: 'Grid Depth', type: 'select', options: ['3x3x3', '2x2x2'], val: '3x3x3' },
            { id: 'twistSpeed', label: 'Twist Turn Speed', type: 'slider', min: 0.2, max: 2.0, step: 0.1, val: 0.8 },
            { id: 'shadowReflection', label: 'Aura Glow Reflection', type: 'select', options: ['Glossy Chrome', 'Retro Flat', 'Matte Clay'], val: 'Glossy Chrome' },
            { id: 'scrambleTurns', label: 'Shuffle Iterations', type: 'slider', min: 5, max: 30, step: 5, val: 15 }
        ]
    },
    {
        id: 'gravity_orbits',
        title: 'Gravity Planet Orbits',
        category: 'physics',
        icon: 'fa-solid fa-space-shuttle',
        glow: 'neon-blue',
        desc: 'Tap and drag to shoot custom planets in 2D. Observe real gravitational orbits and orbits paths.',
        info: 'Simulates Newton\'s Universal Gravitation: F = G * (m1 * m2) / r^2. Calculates multiple body coordinates per tick.',
        params: [
            { id: 'gravConstant', label: 'Constant G', type: 'slider', min: 0.1, max: 4.0, step: 0.1, val: 1.0 },
            { id: 'planetMass', label: 'New Planet Mass', type: 'slider', min: 10, max: 1000, step: 10, val: 200 },
            { id: 'trailsVisibility', label: 'Orbit Paths Decay', type: 'slider', min: 0.8, max: 1.0, step: 0.01, val: 0.98 },
            { id: 'presetSpace', label: 'Orbital Presets', type: 'select', options: ['Double Star System', 'Satellite Sling', 'Black Hole Feast', 'Empty Space'], val: 'Double Star System' }
        ]
    },
    {
        id: 'vaporwave_car',
        title: 'Vaporwave Endless Drive',
        category: '3d',
        icon: 'fa-solid fa-car-side',
        glow: 'neon-pink',
        desc: 'Drive an endless glowing highway under a giant synth sun and speeding wireframe grid palm trees.',
        info: 'Renders an infinite procedural landscape that offsets vertices inversely to camera translation speeds in a retro wireframe style.',
        params: [
            { id: 'driveSpeed', label: 'Driving Speed', type: 'slider', min: 10, max: 120, step: 5, val: 60 },
            { id: 'sunVibe', label: 'Sun Pulse Wave', type: 'slider', min: 0.2, max: 2.0, step: 0.1, val: 1.0 },
            { id: 'retroTone', label: 'Color Filter', type: 'select', options: ['Outrun Neon', 'Sunset Gold', 'Miami Purple'], val: 'Outrun Neon' },
            { id: 'steeringFric', label: 'Steering Sway', type: 'slider', min: 1, max: 10, step: 1, val: 5 }
        ]
    }
];

// --- Application State ---
let currentCategoryId = 'all';
let searchQuery = '';
let activeTool = null;
let scriptLoadTimeout = null;

// Global Configuration shared directly with active simulation files
window.simulationConfig = {};

// --- DOM References ---
const toolsGrid = document.getElementById('tools-grid');
const searchInput = document.getElementById('search-input');
const playgroundScreen = document.getElementById('playground-screen');
const dashboard = document.getElementById('dashboard');
const canvasContainer = document.getElementById('canvas-container');
const controlsPanel = document.getElementById('controls-panel');
const controlsTriggerBtn = document.getElementById('controls-trigger-btn');
const controlsBackdrop = document.getElementById('controls-backdrop');
const panelCloseBtn = document.getElementById('panel-close-btn');
const backBtn = document.getElementById('back-btn');
const currentToolTitle = document.getElementById('current-tool-title');
const currentToolCategory = document.getElementById('current-tool-category');
const currentToolInfo = document.getElementById('current-tool-info');
const panelParameters = document.getElementById('panel-parameters');

// --- Initialization ---
function initApp() {
    renderToolsList();

    // Search events
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderToolsList();
    });

    // Panel Toggle events
    if (controlsTriggerBtn) {
        controlsTriggerBtn.addEventListener('click', toggleControls);
    }
    if (panelCloseBtn) {
        panelCloseBtn.addEventListener('click', closeControls);
    }

    // Back to Dashboard click handler
    backBtn.addEventListener('click', closeActivePlayground);

    // Ambient sound hum toggle
    const ambientBtn = document.getElementById('synth-ambient-toggle');
    if (ambientBtn) {
        ambientBtn.addEventListener('click', toggleAmbientHum);
    }

    // Dynamic Telemetry loop
    startTelemetryHUD();

    // Custom touch/tap glowing particle bursts
    initTouchFeedback();

    // Start Phase 2 Ambient Particle Background
    initAmbientParticles();
}

function openControls() {
    if (!controlsPanel) return;
    controlsPanel.classList.remove('translate-y-full', 'md:translate-x-full');
    controlsPanel.classList.add('translate-y-0', 'md:translate-x-0');
}

function closeControls() {
    if (!controlsPanel) return;
    controlsPanel.classList.remove('translate-y-0', 'md:translate-x-0');
    controlsPanel.classList.add('translate-y-full', 'md:translate-x-full');
}

function toggleControls() {
    if (!controlsPanel) return;
    const isClosed = controlsPanel.classList.contains('translate-y-full') || controlsPanel.classList.contains('md:translate-x-full');
    if (isClosed) {
        openControls();
    } else {
        closeControls();
    }
}

// Global FPS and performance telemetry monitor
let lastTelemetryTime = performance.now();
let telemetryFrameCount = 0;
function startTelemetryHUD() {
    const fpsLabel = document.getElementById('telemetry-fps');
    function updateTelemetry() {
        const now = performance.now();
        telemetryFrameCount++;
        if (now >= lastTelemetryTime + 1000) {
            if (fpsLabel) {
                const fps = Math.round((telemetryFrameCount * 1000) / (now - lastTelemetryTime));
                // Add minor random fluctuation for visual realism (e.g., 58-60 FPS)
                const realisticFps = fps > 60 ? 60 : (fps === 60 ? (Math.random() > 0.7 ? 59 : 60) : fps);
                fpsLabel.innerText = realisticFps;
            }
            telemetryFrameCount = 0;
            lastTelemetryTime = now;
        }
        requestAnimationFrame(updateTelemetry);
    }
    requestAnimationFrame(updateTelemetry);
}

// Phase 2 Procedural Ambient Particles background engine
function initAmbientParticles() {
    const canvas = document.getElementById('ambient-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    const maxParticles = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Populate initial dust
    for (let i = 0; i < maxParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            alpha: Math.random() * 0.5 + 0.1,
            fadeSpeed: Math.random() * 0.005 + 0.002,
            fadeDirection: Math.random() > 0.5 ? 1 : -1
        });
    }

    function animate() {
        // Only render when dashboard is active/visible
        if (dashboard && !dashboard.classList.contains('hidden')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                
                // Drift physics
                p.x += p.vx;
                p.y += p.vy;

                // Wrap-around bounds checks
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Soft alpha pulse
                p.alpha += p.fadeSpeed * p.fadeDirection;
                if (p.alpha > 0.6) {
                    p.alpha = 0.6;
                    p.fadeDirection = -1;
                } else if (p.alpha < 0.1) {
                    p.alpha = 0.1;
                    p.fadeDirection = 1;
                }

                // Render particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
                ctx.fill();
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// Check readyState to prevent race condition where DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// --- UI Rendering ---
function renderToolsList() {
    toolsGrid.innerHTML = '';

    const filtered = PLAYGROUND_REGISTRY.filter(tool => {
        const matchesCategory = currentCategoryId === 'all' || tool.category === currentCategoryId;
        const matchesSearch = tool.title.toLowerCase().includes(searchQuery) || tool.desc.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        toolsGrid.innerHTML = `
            <div class="col-span-full py-16 text-center text-gray-500 font-mono">
                <i class="fa-solid fa-ban text-2xl mb-3 text-neon-blue/40"></i>
                <div>No playground modules match search filter.</div>
            </div>
        `;
        return;
    }

    filtered.forEach((tool, index) => {
        const card = document.createElement('div');
        // Custom stagger animation delays
        card.style.animationDelay = `${index * 45}ms`;
        // Setting up dynamic glow boundaries and premium glass layouts
        card.className = `animate-fade-in-up group relative rounded-2xl bg-gray-900/40 p-6 border border-white/5 hover:border-${tool.glow}/30 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between shadow-lg h-[240px]`;
        
        // Custom neon box-shadow class based on glow attribute
        card.addEventListener('mouseenter', () => {
            card.classList.add(`shadow-${tool.glow}`);
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove(`shadow-${tool.glow}`);
        });

        card.innerHTML = `
            <!-- Neon Overlay Glow -->
            <div class="absolute -right-16 -top-16 w-32 h-32 bg-neon-blue/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

            <div class="relative">
                <div class="flex justify-between items-center mb-4">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-950 border border-white/10 group-hover:border-${tool.glow}/40 transition-colors">
                        <i class="${tool.icon} text-lg text-gray-400 group-hover:text-${tool.glow === 'neon-blue' ? 'neon-blue' : tool.glow === 'neon-green' ? 'neon-green' : tool.glow === 'neon-purple' ? 'neon-purple' : 'neon-pink'} transition-colors"></i>
                    </div>
                    <span class="text-[10px] font-mono tracking-widest text-gray-500 uppercase">${tool.category}</span>
                </div>
                <h2 class="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">${tool.title}</h2>
                <p class="mt-2 text-xs text-gray-400 font-mono line-clamp-3 leading-relaxed">${tool.desc}</p>
            </div>

            <div class="flex items-center justify-between text-[11px] font-mono tracking-wider mt-4 text-gray-500 group-hover:text-white transition-colors">
                <span class="uppercase">LAUNCH PLAYGROUND</span>
                <i class="fa-solid fa-arrow-right-long transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300"></i>
            </div>
        `;

        card.addEventListener('click', () => {
            launchPlayground(tool);
        });

        toolsGrid.appendChild(card);
    });
}

function filterCategory(categoryId) {
    currentCategoryId = categoryId;
    
    // Update active filter button styling
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.className = "category-btn px-4 py-1.5 rounded-full text-xs font-mono bg-gray-900/50 text-gray-400 border border-white/5 hover:border-white/25 transition-all duration-300";
    });

    const activeBtn = Array.from(buttons).find(btn => btn.innerText.toLowerCase() === categoryId.toLowerCase() || (categoryId === 'all' && btn.innerText.toLowerCase() === 'all'));
    if (activeBtn) {
        let activeGlow = 'neon-blue';
        if (categoryId === 'physics') activeGlow = 'neon-green';
        else if (categoryId === '3d') activeGlow = 'neon-purple';
        else if (categoryId === 'generative') activeGlow = 'neon-pink';
        else if (categoryId === 'canvas') activeGlow = 'neon-blue';
        
        activeBtn.className = `category-btn px-4 py-1.5 rounded-full text-xs font-mono bg-${activeGlow}/20 text-${activeGlow === 'neon-blue' ? 'neon-blue' : activeGlow === 'neon-green' ? 'neon-green' : activeGlow === 'neon-purple' ? 'neon-purple' : 'neon-pink'} border border-${activeGlow === 'neon-blue' ? 'neon-blue' : activeGlow === 'neon-green' ? 'neon-green' : activeGlow === 'neon-purple' ? 'neon-purple' : 'neon-pink'}/30 shadow-md shadow-${activeGlow}/10 transition-all duration-300`;
    }

    renderToolsList();
}

// --- Playground Loader Engine ---
function launchPlayground(tool) {
    activeTool = tool;
    
    // Hide dashboard, show full-screen immersive panel
    dashboard.classList.add('hidden');
    playgroundScreen.classList.remove('hidden');

    // Update screen metadata
    currentToolTitle.innerText = tool.title;
    currentToolCategory.innerText = tool.category;
    currentToolCategory.className = `text-[10px] font-mono tracking-widest text-white uppercase px-2 py-0.5 rounded border`;
    
    // Customize border/background of category tag based on item glow
    let glowColor = '#00f0ff';
    if (tool.glow === 'neon-green') { glowColor = '#00ff66'; currentToolCategory.classList.add('bg-neon-green/10', 'border-neon-green/30', 'text-neon-green'); }
    else if (tool.glow === 'neon-purple') { glowColor = '#bd00ff'; currentToolCategory.classList.add('bg-neon-purple/10', 'border-neon-purple/30', 'text-neon-purple'); }
    else if (tool.glow === 'neon-pink') { glowColor = '#ff007f'; currentToolCategory.classList.add('bg-neon-pink/10', 'border-neon-pink/30', 'text-neon-pink'); }
    else { currentToolCategory.classList.add('bg-neon-blue/10', 'border-neon-blue/30', 'text-neon-blue'); }

    currentToolInfo.innerText = tool.info;

    // Render parameters inputs inside sidebar
    renderParametersUI(tool);

    // Initialize shared state dictionary
    window.simulationConfig = {};
    tool.params.forEach(p => {
        window.simulationConfig[p.id] = p.val;
    });

    // Load simulation script dynamically
    loadSimulationScript(tool.id);
}

function renderParametersUI(tool) {
    panelParameters.innerHTML = '';

    tool.params.forEach(param => {
        const item = document.createElement('div');
        item.className = "flex flex-col space-y-2";

        if (param.type === 'slider') {
            item.innerHTML = `
                <div class="flex justify-between items-center text-xs font-mono">
                    <span class="text-gray-400 font-bold">${param.label}</span>
                    <span id="val-${param.id}" class="text-neon-blue font-semibold">${param.val}</span>
                </div>
                <input id="input-${param.id}" type="range" min="${param.min}" max="${param.max}" step="${param.step}" value="${param.val}" class="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-blue">
            `;
            // Hook up change events immediately
            setTimeout(() => {
                const el = document.getElementById(`input-${param.id}`);
                const readEl = document.getElementById(`val-${param.id}`);
                if (el) {
                    el.addEventListener('input', (e) => {
                        const parsed = parseFloat(e.target.value);
                        readEl.innerText = parsed;
                        window.simulationConfig[param.id] = parsed;
                        if (window.currentSimulation && typeof window.currentSimulation.onConfigChange === 'function') {
                            window.currentSimulation.onConfigChange(param.id, parsed);
                        }
                    });
                }
            }, 50);

        } else if (param.type === 'select') {
            const optionsHtml = param.options.map(opt => `<option value="${opt}" ${opt === param.val ? 'selected' : ''} class="bg-gray-900">${opt}</option>`).join('');
            item.innerHTML = `
                <label class="text-xs font-mono text-gray-400 font-bold mb-1">${param.label}</label>
                <div class="relative">
                    <select id="input-${param.id}" class="w-full bg-gray-800 border border-white/5 rounded-lg py-2 px-3 text-xs font-mono text-white appearance-none focus:outline-none focus:border-neon-blue">
                        ${optionsHtml}
                    </select>
                    <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[10px] pointer-events-none"></i>
                </div>
            `;
            setTimeout(() => {
                const el = document.getElementById(`input-${param.id}`);
                if (el) {
                    el.addEventListener('change', (e) => {
                        const selectedVal = e.target.value;
                        window.simulationConfig[param.id] = selectedVal;
                        if (window.currentSimulation && typeof window.currentSimulation.onConfigChange === 'function') {
                            window.currentSimulation.onConfigChange(param.id, selectedVal);
                        }
                    });
                }
            }, 50);
        } else if (param.type === 'checkbox') {
            item.innerHTML = `
                <label class="relative flex items-center cursor-pointer">
                    <input id="input-${param.id}" type="checkbox" ${param.val ? 'checked' : ''} class="sr-only peer">
                    <div class="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-neon-blue peer-checked:bg-neon-blue/20 peer-checked:border-neon-blue/40 border border-white/5"></div>
                    <span class="ml-3 text-xs font-mono text-gray-400 font-bold">${param.label}</span>
                </label>
            `;
            setTimeout(() => {
                const el = document.getElementById(`input-${param.id}`);
                if (el) {
                    el.addEventListener('change', (e) => {
                        const checkedVal = e.target.checked;
                        window.simulationConfig[param.id] = checkedVal;
                        if (window.currentSimulation && typeof window.currentSimulation.onConfigChange === 'function') {
                            window.currentSimulation.onConfigChange(param.id, checkedVal);
                        }
                    });
                }
            }, 50);
        }

        panelParameters.appendChild(item);
    });
}

function loadSimulationScript(simId) {
    // Show fallback loader immediately in canvas container
    canvasContainer.innerHTML = `
        <div class="absolute inset-0 flex flex-col items-center justify-center font-mono text-sm text-gray-500 gap-4">
            <i class="fa-solid fa-atom animate-spin text-neon-blue text-4xl"></i>
            <div>Initializing 3D Matrix buffers...</div>
        </div>
    `;

    // Remove any previously loaded simulation script tag
    const existingScript = document.getElementById('active-sim-script');
    if (existingScript) existingScript.remove();

    // Setup script source path relative to asset root
    const script = document.createElement('script');
    script.id = 'active-sim-script';
    script.src = `simulations/${simId}.js`;

    script.onload = () => {
        // Clear loader and initialize the fresh script
        canvasContainer.innerHTML = '';
        if (window.initSimulation && typeof window.initSimulation === 'function') {
            window.initSimulation(canvasContainer, window.simulationConfig);
        }
    };

    script.onerror = () => {
        canvasContainer.innerHTML = `
            <div class="absolute inset-0 flex flex-col items-center justify-center font-mono text-sm text-neon-crimson bg-black/80 gap-3">
                <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
                <div>Failed to inject simulation runtime error.</div>
                <button onclick="loadSimulationScript('${simId}')" class="px-3 py-1 bg-white/10 rounded text-xs text-white border border-white/20 hover:bg-white/20 transition-colors">RETRY LOAD</button>
            </div>
        `;
    };

    document.head.appendChild(script);
}

// --- Garbage Collection & Unloading Engine (CRITICAL) ---
function closeActivePlayground() {
    // 1. Tidy up the active running script
    if (window.currentSimulation) {
        if (typeof window.currentSimulation.destroy === 'function') {
            try {
                window.currentSimulation.destroy();
            } catch (err) {
                console.error("Error tearing down running simulation instance: ", err);
            }
        }
        window.currentSimulation = null;
    }

    // 2. Erase the script tag
    const existingScript = document.getElementById('active-sim-script');
    if (existingScript) existingScript.remove();

    // 3. Clear window global overrides to prevent overlapping context runs
    window.initSimulation = null;

    // 4. Close parameters controls sheet/panel cleanly
    closeControls();

    // 5. Force empty the graphics render container
    canvasContainer.innerHTML = '';

    // 6. Hide simulation panels, restore standard lists
    playgroundScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');

    activeTool = null;
    renderToolsList();
}

function resetCurrentSimulation() {
    if (activeTool) {
        closeActivePlayground();
        setTimeout(() => {
            launchPlayground(activeTool);
        }, 150);
    }
}

// Interactive tap/drag glowing particle burst feedback
let touchCanvas, touchCtx;
let touchParticles = [];
function initTouchFeedback() {
    touchCanvas = document.getElementById('touch-canvas');
    if (!touchCanvas) return;
    touchCtx = touchCanvas.getContext('2d');
    
    const resize = () => {
        touchCanvas.width = touchCanvas.clientWidth || window.innerWidth;
        touchCanvas.height = touchCanvas.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const handleInteraction = (x, y) => {
        const colors = ['#00f0ff', '#bd00ff', '#ff007f', '#00ff66', '#ffd700'];
        // Spawn glowing particles
        for (let i = 0; i < 8; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1;
            touchParticles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 3.5 + 1.5,
                alpha: 1.0,
                decay: Math.random() * 0.04 + 0.02,
                color: color
            });
        }
    };
    
    // Add touch and mouse event listeners
    playgroundScreen.addEventListener('mousedown', (e) => {
        handleInteraction(e.clientX, e.clientY);
    }, { passive: true });
    
    playgroundScreen.addEventListener('mousemove', (e) => {
        if (e.buttons === 1 && Math.random() < 0.3) {
            handleInteraction(e.clientX, e.clientY);
        }
    }, { passive: true });
    
    playgroundScreen.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
    
    playgroundScreen.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0 && Math.random() < 0.3) {
            handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
    
    function drawParticles() {
        touchCtx.clearRect(0, 0, touchCanvas.width, touchCanvas.height);
        
        for (let i = touchParticles.length - 1; i >= 0; i--) {
            const p = touchParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            p.radius *= 0.96;
            
            if (p.alpha <= 0 || p.radius < 0.5) {
                touchParticles.splice(i, 1);
                continue;
            }
            
            touchCtx.save();
            touchCtx.globalAlpha = p.alpha;
            touchCtx.beginPath();
            touchCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            touchCtx.fillStyle = p.color;
            touchCtx.shadowColor = p.color;
            touchCtx.shadowBlur = 12;
            touchCtx.fill();
            touchCtx.restore();
        }
        requestAnimationFrame(drawParticles);
    }
    requestAnimationFrame(drawParticles);
}

// Procedural Analog space-drone hum generator (Web Audio API)
let ambientAudioCtx = null;
let ambientOsc1 = null;
let ambientOsc2 = null;
let ambientFilter = null;
let ambientLfo = null;
let ambientLfoGain = null;

function toggleAmbientHum() {
    const btn = document.getElementById('synth-ambient-toggle');
    if (!btn) return;

    if (ambientAudioCtx && ambientAudioCtx.state === 'running') {
        stopAmbientHum();
        btn.className = "relative z-10 w-full sm:w-auto px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 hover:border-neon-purple text-neon-purple text-[10px] font-mono tracking-widest uppercase rounded-lg shadow-md transition-all flex items-center justify-center gap-2";
        btn.innerHTML = '<i id="synth-ambient-icon" class="fa-solid fa-play"></i> GENERATE SPACE HUM';
    } else {
        startAmbientHum();
        btn.className = "relative z-10 w-full sm:w-auto px-4 py-2 bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green/30 hover:border-neon-green text-neon-green text-[10px] font-mono tracking-widest uppercase rounded-lg shadow-md transition-all flex items-center justify-center gap-2";
        btn.innerHTML = '<i id="synth-ambient-icon" class="fa-solid fa-pause"></i> AMBIENT ACTIVE';
    }
}

function startAmbientHum() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        ambientAudioCtx = new AudioContext();
        
        // Lowpass Filter for warm sub-bassy drone
        ambientFilter = ambientAudioCtx.createBiquadFilter();
        ambientFilter.type = 'lowpass';
        ambientFilter.frequency.setValueAtTime(95, ambientAudioCtx.currentTime);
        ambientFilter.Q.setValueAtTime(3.5, ambientAudioCtx.currentTime);
        
        // Main volume gain
        const masterGain = ambientAudioCtx.createGain();
        masterGain.gain.setValueAtTime(0.0, ambientAudioCtx.currentTime);
        // Ramp volume in smoothly to avoid pops
        masterGain.gain.linearRampToValueAtTime(0.35, ambientAudioCtx.currentTime + 1.5);
        
        // Low triangle wave osc
        ambientOsc1 = ambientAudioCtx.createOscillator();
        ambientOsc1.type = 'triangle';
        ambientOsc1.frequency.setValueAtTime(55, ambientAudioCtx.currentTime); // A1 pitch
        
        // Slightly detuned sawtooth osc to create acoustic phase beating
        ambientOsc2 = ambientAudioCtx.createOscillator();
        ambientOsc2.type = 'sawtooth';
        ambientOsc2.frequency.setValueAtTime(55.3, ambientAudioCtx.currentTime);
        
        // Slow LFO to breathe the filter frequency
        ambientLfo = ambientAudioCtx.createOscillator();
        ambientLfo.type = 'sine';
        ambientLfo.frequency.setValueAtTime(0.08, ambientAudioCtx.currentTime); // 12 second sweep
        
        ambientLfoGain = ambientAudioCtx.createGain();
        ambientLfoGain.gain.setValueAtTime(35, ambientAudioCtx.currentTime); // modulate filter range
        
        // Connections
        ambientLfo.connect(ambientLfoGain);
        ambientLfoGain.connect(ambientFilter.frequency);
        
        ambientOsc1.connect(ambientFilter);
        ambientOsc2.connect(ambientFilter);
        ambientFilter.connect(masterGain);
        masterGain.connect(ambientAudioCtx.destination);
        
        // Start playbacks
        ambientOsc1.start();
        ambientOsc2.start();
        ambientLfo.start();
    } catch (e) {
        console.error("Could not run ambient soundscape generator: ", e);
    }
}

function stopAmbientHum() {
    if (ambientOsc1) {
        try { ambientOsc1.stop(); } catch(e) {}
        ambientOsc1 = null;
    }
    if (ambientOsc2) {
        try { ambientOsc2.stop(); } catch(e) {}
        ambientOsc2 = null;
    }
    if (ambientLfo) {
        try { ambientLfo.stop(); } catch(e) {}
        ambientLfo = null;
    }
    if (ambientAudioCtx) {
        try { ambientAudioCtx.close(); } catch(e) {}
        ambientAudioCtx = null;
    }
}
