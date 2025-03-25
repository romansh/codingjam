// Set up canvas
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Colors for realistic field look
const colors = {
    skyTop: '#1e3c72',
    skyBottom: '#4CA1AF',
    sunGlow: '#FFB347',
    fieldFar: '#2D7D46',
    fieldNear: '#3CB371',
    primitives: ['#FF69B4', '#E2CCFF', '#9370DB', '#FFB6C1', '#DDA0DD']
};

// Sine wave parameters for a more natural horizon
const wave = {
    amplitude: 15,
    frequency: 0.005,
    speed: 0.002,
    offset: 0
};

// Primitive Cloud shapes
const primitiveShapes = [
    'circle',
    'triangle',
    'rectangle',
    'diamond'
];

// Cloud parameters
const clouds = [];

function createCloud() {
    const isMobile = window.innerWidth < 768;
    return {
        x: canvas.width + Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.4,
        speed: 0.3 + Math.random() * 0.3,
        size: isMobile ? (20 + Math.random() * 20) : (30 + Math.random() * 40),
        shape: primitiveShapes[Math.floor(Math.random() * primitiveShapes.length)],
        color: colors.primitives[Math.floor(Math.random() * colors.primitives.length)],
        opacity: 0.4 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        active: true
    };
}

function getInitialCloudCount() {
    const isMobile = window.innerWidth < 768;
    return isMobile ? 4 : 10;
}

function initializeClouds() {
    clouds.length = 0;
    for (let i = 0; i < getInitialCloudCount(); i++) {
        const cloud = createCloud();
        cloud.x = Math.random() * canvas.width * 1.5;
        clouds.push(cloud);
    }
}

initializeClouds();

const grassTufts = [];

function createGrassTufts() {
    const horizonY = canvas.height * 0.6;
    for (let x = 0; x < canvas.width; x += 15) {
        const heightVariation = Math.random() * 10;
        grassTufts.push({
            x: x + Math.random() * 10 - 5,
            baseY: horizonY + Math.sin((x * wave.frequency) + wave.offset) * wave.amplitude,
            height: 5 + heightVariation,
            width: 2 + Math.random() * 3,
            swaySpeed: 0.01 + Math.random() * 0.02,
            swayOffset: Math.random() * Math.PI * 2
        });
    }
    // Ensure grass reaches the right edge by adding an extra tuft
    grassTufts.push({
        x: canvas.width - 1,
        baseY: horizonY + Math.sin((canvas.width * wave.frequency) + wave.offset) * wave.amplitude,
        height: 5 + Math.random() * 10,
        width: 2 + Math.random() * 3,
        swaySpeed: 0.01 + Math.random() * 0.02,
        swayOffset: Math.random() * Math.PI * 2
    });
}

const textPrimitives = [
    { text: "VIBE", x: 0.2, y: 0.65, speed: 0.3, size: 16, shape: 0, padding: 10 },
    { text: "CODE", x: 0.4, y: 0.7, speed: 0.2, size: 16, shape: 1, padding: 12 },
    { text: "CREATE", x: 0.6, y: 0.63, speed: 0.25, size: 16, shape: 2, padding: 10 },
    { text: "PLAY", x: 0.8, y: 0.72, speed: 0.35, size: 16, shape: 1, padding: 8 }
];

const sun = {
    x: canvas.width * 0.85,
    y: canvas.height * 0.2,
    radius: 40,
    glowSize: 60,
    glowOpacity: 0.3
};

const explosions = [];

function createExplosion(x, y, color) {
    const particles = [];
    const particleCount = 20 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        const size = 2 + Math.random() * 5;
        const life = 30 + Math.random() * 20;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: size,
            life: life,
            maxLife: life,
            color: color
        });
    }
    
    explosions.push({
        x: x,
        y: y,
        particles: particles,
        age: 0
    });
}

function drawSky() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
    gradient.addColorStop(0, colors.skyTop);
    gradient.addColorStop(1, colors.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);
}

function drawSun() {
    const gradient = ctx.createRadialGradient(
        sun.x, sun.y, sun.radius * 0.5,
        sun.x, sun.y, sun.radius * 3
    );
    gradient.addColorStop(0, 'rgba(255, 179, 71, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 179, 71, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 179, 71, 0)');
    
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
}

function drawPrimitiveCloud(cloud) {
    if (!cloud.active) return;
    
    ctx.save();
    ctx.globalAlpha = cloud.opacity;
    ctx.fillStyle = cloud.color;
    ctx.translate(cloud.x, cloud.y);
    ctx.rotate(cloud.rotation);
    
    switch(cloud.shape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, cloud.size, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -cloud.size);
            ctx.lineTo(cloud.size, cloud.size);
            ctx.lineTo(-cloud.size, cloud.size);
            ctx.closePath();
            ctx.fill();
            break;
        case 'rectangle':
            ctx.fillRect(-cloud.size, -cloud.size/2, cloud.size * 2, cloud.size);
            break;
        case 'diamond':
            ctx.beginPath();
            ctx.moveTo(0, -cloud.size);
            ctx.lineTo(cloud.size, 0);
            ctx.lineTo(0, cloud.size);
            ctx.lineTo(-cloud.size, 0);
            ctx.closePath();
            ctx.fill();
            break;
    }
    
    ctx.restore();
}

function drawClouds() {
    clouds.forEach(cloud => {
        if (cloud.active) {
            drawPrimitiveCloud(cloud);
        }
    });
}

function drawHorizon() {
    const points = [];
    const horizonY = canvas.height * 0.6;
    
    // Collect horizon points with sine wave variation
    for (let x = 0; x < canvas.width; x += 10) {
        const y = horizonY + Math.sin((x * wave.frequency) + wave.offset) * wave.amplitude;
        points.push({x, y});
    }
    // Explicitly add the last point at the right edge to ensure field reaches canvas edge
    points.push({
        x: canvas.width,
        y: horizonY + Math.sin((canvas.width * wave.frequency) + wave.offset) * wave.amplitude
    });

    ctx.beginPath();
    ctx.moveTo(0, points[0].y);
    
    // Draw smooth curve through all points
    for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    
    // Complete the path to fill the field area
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    
    const fieldGradient = ctx.createLinearGradient(0, horizonY, 0, canvas.height);
    fieldGradient.addColorStop(0, colors.fieldFar);
    fieldGradient.addColorStop(1, colors.fieldNear);
    
    ctx.fillStyle = fieldGradient;
    ctx.fill();
    
    // Generate grass tufts if not already created
    if (grassTufts.length === 0) {
        createGrassTufts();
    }
    
    // Draw swaying grass tufts
    grassTufts.forEach(tuft => {
        const sway = Math.sin(Date.now() * tuft.swaySpeed + tuft.swayOffset) * 2;
        
        ctx.beginPath();
        ctx.moveTo(tuft.x, tuft.baseY);
        ctx.quadraticCurveTo(
            tuft.x + sway, 
            tuft.baseY - tuft.height / 2,
            tuft.x + sway * 1.5, 
            tuft.baseY - tuft.height
        );
        
        const grassGradient = ctx.createLinearGradient(0, tuft.baseY, 0, tuft.baseY - tuft.height);
        grassGradient.addColorStop(0, colors.fieldNear);
        grassGradient.addColorStop(1, '#45D159');
        
        ctx.strokeStyle = grassGradient;
        ctx.lineWidth = tuft.width;
        ctx.stroke();
    });
}

function drawExplosions() {
    explosions.forEach((explosion, index) => {
        explosion.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.05;
            particle.life--;
        });
        
        explosion.particles = explosion.particles.filter(p => p.life > 0);
        if (explosion.particles.length === 0) {
            explosions.splice(index, 1);
        }
    });
    ctx.globalAlpha = 1;
}

function drawTextPrimitives() {
    textPrimitives.forEach(primitive => {
        const x = primitive.x * canvas.width;
        const y = canvas.height * primitive.y + Math.sin(wave.offset * primitive.speed) * 15;
        
        ctx.font = `bold ${primitive.size}px Inter, sans-serif`;
        const textWidth = ctx.measureText(primitive.text).width;
        const textHeight = primitive.size;
        
        let shapeWidth, shapeHeight;
        switch(primitive.shape) {
            case 0: // Circle
                const radius = Math.max(textWidth, textHeight) / 2 + primitive.padding;
                shapeWidth = radius * 2;
                shapeHeight = radius * 2;
                break;
            case 1: // Rectangle
                shapeWidth = textWidth + primitive.padding * 2;
                shapeHeight = textHeight + primitive.padding * 2;
                break;
            case 2: // Triangle
                shapeWidth = textWidth + primitive.padding * 2;
                shapeHeight = textHeight * 2 + primitive.padding * 2;
                break;
        }
        
        ctx.fillStyle = colors.primitives[Math.floor(Date.now() / 2000) % colors.primitives.length];
        switch(primitive.shape) {
            case 0:
                ctx.beginPath();
                ctx.arc(x, y, shapeWidth / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 1:
                ctx.fillRect(x - shapeWidth / 2, y - shapeHeight / 2, shapeWidth, shapeHeight);
                break;
            case 2:
                ctx.beginPath();
                ctx.moveTo(x, y - shapeHeight / 2);
                ctx.lineTo(x + shapeWidth / 2, y + shapeHeight / 2);
                ctx.lineTo(x - shapeWidth / 2, y + shapeHeight / 2);
                ctx.closePath();
                ctx.fill();
                break;
        }
        
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(primitive.text, x, y);
    });
}

function isPointInCloud(x, y, cloud) {
    if (!cloud.active) return false;
    
    const dx = x - cloud.x;
    const dy = y - cloud.y;
    const rotatedX = dx * Math.cos(-cloud.rotation) - dy * Math.sin(-cloud.rotation);
    const rotatedY = dx * Math.sin(-cloud.rotation) + dy * Math.cos(-cloud.rotation);
    
    switch(cloud.shape) {
        case 'circle':
            return Math.sqrt(rotatedX * rotatedX + rotatedY * rotatedY) <= cloud.size;
        case 'triangle':
            if (rotatedY > cloud.size || rotatedY < -cloud.size) return false;
            const width = cloud.size * (1 - rotatedY / cloud.size);
            return Math.abs(rotatedX) <= width;
        case 'rectangle':
            return Math.abs(rotatedX) <= cloud.size && Math.abs(rotatedY) <= cloud.size/2;
        case 'diamond':
            return (Math.abs(rotatedX) / cloud.size + Math.abs(rotatedY) / cloud.size) <= 1;
    }
    return false;
}

function handleCanvasInteraction(e) {
    const event = e.touches ? e.touches[0] : e;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    canvas.style.pointerEvents = 'none';
    const elementUnder = document.elementFromPoint(event.clientX, event.clientY);
    canvas.style.pointerEvents = 'auto';
    
    let isInteractiveElement = false;
    let current = elementUnder;
    while (current && current !== document.body) {
        if (
            current.tagName === 'A' || 
            current.tagName === 'BUTTON' ||
            current.classList.contains('button') ||
            current.classList.contains('person') ||
            (current.getAttribute && current.getAttribute('role') === 'button')
        ) {
            isInteractiveElement = true;
            break;
        }
        current = current.parentElement;
    }
    
    if (isInteractiveElement) return;
    
    let hitCloud = false;
    clouds.forEach((cloud, index) => {
        if (cloud.active && isPointInCloud(x, y, cloud)) {
            createExplosion(cloud.x, cloud.y, cloud.color);
            clouds.splice(index, 1);
            clouds.push(createCloud());
            hitCloud = true;
        }
    });
    
    if (!hitCloud) {
        const missColor = 'rgba(255, 255, 255, 0.7)';
        const missExplosion = {
            x: x,
            y: y,
            particles: [],
            age: 0
        };
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 1.5;
            missExplosion.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 1 + Math.random() * 2,
                life: 15 + Math.random() * 10,
                maxLife: 15 + Math.random() * 10,
                color: missColor
            });
        }
        explosions.push(missExplosion);
    }
    e.preventDefault();
}

canvas.addEventListener('click', handleCanvasInteraction);
canvas.addEventListener('touchstart', function(e) {
    handleCanvasInteraction(e);
}, { passive: false });

let lastTime = 0;
let animationFrameId = null;
let isAnimating = true;

function animate(timestamp) {
    if (!isAnimating) return;
    if (!lastTime) lastTime = timestamp;
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    deltaTime = Math.min(deltaTime, 100);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    wave.offset += wave.speed * (deltaTime / 16);
    
    drawSky();
    drawSun();
    drawClouds();
    drawHorizon();
    drawTextPrimitives();
    drawExplosions();
    
    clouds.forEach(cloud => {
        if (cloud.active) {
            cloud.x -= cloud.speed * (deltaTime / 16);
            cloud.rotation += cloud.rotationSpeed * (deltaTime / 16);
            if (cloud.x + cloud.size < -100) {
                cloud.x = canvas.width + cloud.size * 2;
                cloud.y = Math.random() * canvas.height * 0.4;
                cloud.size = window.innerWidth < 768 ? (20 + Math.random() * 20) : (30 + Math.random() * 40);
                cloud.shape = primitiveShapes[Math.floor(Math.random() * primitiveShapes.length)];
                cloud.speed = 0.3 + Math.random() * 0.3;
            }
        }
    });
    
    if (grassTufts.length > 0) {
        grassTufts.forEach(tuft => {
            tuft.baseY = canvas.height * 0.6 + Math.sin((tuft.x * wave.frequency) + wave.offset) * wave.amplitude;
        });
    }
    
    animationFrameId = requestAnimationFrame(animate);
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        isAnimating = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    } else {
        isAnimating = true;
        lastTime = performance.now();
        requestAnimationFrame(animate);
    }
});

requestAnimationFrame(animate);

window.addEventListener('resize', () => {
    resizeCanvas();
    grassTufts.length = 0; // Clear grass tufts to regenerate them
    sun.x = canvas.width * 0.85;
    sun.y = canvas.height * 0.2;
    initializeClouds();
});

function updateCountdown() {
    const now = new Date();
    const deadline = new Date('April 1, 2025 23:59:59 GMT');
    const difference = deadline - now;
    
    if (difference <= 0) {
        document.getElementById('countdown').innerHTML = 'Submissions closed!';
        return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    document.getElementById('countdown').innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Load games from CSV
async function loadGamesFromCSV() {
    try {
        const response = await fetch('games.csv');
        const csvText = await response.text();
        const games = parseCSV(csvText);
        populateGameGrid(games);
    } catch (error) {
        console.error('Error loading CSV:', error);
        document.getElementById('game-grid').innerHTML = '<p>Error loading games. Please try again later.</p>';
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        return headers.reduce((obj, header, i) => {
            obj[header] = values[i];
            return obj;
        }, {});
    });
}

function populateGameGrid(games) {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = '';
    
    games.forEach(game => {
        const gameElement = `
            <div class="game-example" data-loaded="false">
                <a href="${game.url}" class="game-link">
                    <div class="game-info">
                        <h3>${game.title}</h3>
                        <img src="${game.screenshot}" alt="${game.title} Screenshot" class="game-screenshot" loading="lazy">
                        <div class="game-links">
                            <a href="${game.x_profile}" target="_blank" class="game-creator">${game.x_profile.split('/').pop()}</a>
                        </div>
                    </div>
                </a>
            </div>
        `;
        gameGrid.insertAdjacentHTML('beforeend', gameElement);
    });
}

function setupLazyLoading() {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const gameElement = entry.target;
                if (gameElement.dataset.loaded === "false") {
                    const img = gameElement.querySelector('.game-screenshot');
                    img.src = img.getAttribute('src');
                    gameElement.dataset.loaded = "true";
                }
            }
        });
    }, {
        rootMargin: '100px'
    });

    document.querySelectorAll('.game-example').forEach(game => observer.observe(game));
}

document.addEventListener('DOMContentLoaded', () => {
    loadGamesFromCSV().then(() => setupLazyLoading());
});
