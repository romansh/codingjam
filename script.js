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
    return {
        x: Math.random() * canvas.width * 1.5 + canvas.width,  // Start off-screen to the right
        y: Math.random() * canvas.height * 0.4,
        speed: 0.3 + Math.random() * 0.3,
        size: 30 + Math.random() * 40,
        shape: primitiveShapes[Math.floor(Math.random() * primitiveShapes.length)],
        color: colors.primitives[Math.floor(Math.random() * colors.primitives.length)],
        opacity: 0.4 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        active: true // Flag to check if cloud is active or exploded
    };
}

// Create primitive clouds initially at distributed positions
for (let i = 0; i < 15; i++) {
    const cloud = createCloud();
    // Distribute clouds across the width of the canvas
    cloud.x = Math.random() * canvas.width * 2;
    clouds.push(cloud);
}

// Grass tufts for realistic field
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
}

// Floating text primitives with adjusted sizes to fit better
const textPrimitives = [
    { text: "VIBE", x: 0.2, y: 0.65, speed: 0.3, size: 16, shape: 0, padding: 10 },
    { text: "CODE", x: 0.4, y: 0.7, speed: 0.2, size: 16, shape: 1, padding: 12 },
    { text: "CREATE", x: 0.6, y: 0.63, speed: 0.25, size: 16, shape: 2, padding: 10 },
    { text: "PLAY", x: 0.8, y: 0.72, speed: 0.35, size: 16, shape: 1, padding: 8 }
];

// Sun in the scene
const sun = {
    x: canvas.width * 0.85,
    y: canvas.height * 0.2,
    radius: 40,
    glowSize: 60,
    glowOpacity: 0.3
};

// Explosion effect
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

// Draw sky with gradient
function drawSky() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
    gradient.addColorStop(0, colors.skyTop);
    gradient.addColorStop(1, colors.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);
}

// Draw sun with glow
function drawSun() {
    // Draw glow
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
    
    // Draw sun
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
}

// Draw primitive cloud
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

// Draw all clouds
function drawClouds() {
    clouds.forEach(cloud => {
        if (cloud.active) {
            drawPrimitiveCloud(cloud);
        }
    });
}

// Draw the horizon (field)
function drawHorizon() {
    // Define wave points for the horizon
    const points = [];
    const horizonY = canvas.height * 0.6;
    
    for (let x = 0; x <= canvas.width; x += 10) {
        const y = horizonY + Math.sin((x * wave.frequency) + wave.offset) * wave.amplitude;
        points.push({x, y});
    }
    
    // Draw the field using a gradient
    ctx.beginPath();
    ctx.moveTo(0, points[0].y);
    
    // Create smooth curve through points
    for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    
    // Complete the shape
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    
    // Field gradient
    const fieldGradient = ctx.createLinearGradient(0, horizonY, 0, canvas.height);
    fieldGradient.addColorStop(0, colors.fieldFar);
    fieldGradient.addColorStop(1, colors.fieldNear);
    
    ctx.fillStyle = fieldGradient;
    ctx.fill();
    
    // Draw grass tufts on horizon line
    if (grassTufts.length === 0) {
        createGrassTufts();
    }
    
    grassTufts.forEach(tuft => {
        // Calculate sway based on time
        const sway = Math.sin(Date.now() * tuft.swaySpeed + tuft.swayOffset) * 2;
        
        // Draw grass tuft
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

// Draw explosions
function drawExplosions() {
    explosions.forEach((explosion, index) => {
        explosion.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Update particle position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Add gravity
            particle.vy += 0.05;
            
            // Reduce life
            particle.life--;
        });
        
        // Remove particles that are dead
        explosion.particles = explosion.particles.filter(p => p.life > 0);
        
        // Remove explosion if all particles are gone
        if (explosion.particles.length === 0) {
            explosions.splice(index, 1);
        }
    });
    
    ctx.globalAlpha = 1;
}

// Draw text primitives
function drawTextPrimitives() {
    textPrimitives.forEach(primitive => {
        const x = primitive.x * canvas.width;
        const y = canvas.height * primitive.y + Math.sin(wave.offset * primitive.speed) * 15;
        
        // Measure text width for better fit
        ctx.font = `bold ${primitive.size}px Inter, sans-serif`;
        const textWidth = ctx.measureText(primitive.text).width;
        const textHeight = primitive.size;
        
        // Calculate shape size based on text dimensions and padding
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
        
        // Draw shape
        ctx.fillStyle = colors.primitives[Math.floor(Date.now() / 2000) % colors.primitives.length];
        
        switch(primitive.shape) {
            case 0: // Circle
                ctx.beginPath();
                ctx.arc(x, y, shapeWidth / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 1: // Rectangle
                ctx.fillRect(x - shapeWidth / 2, y - shapeHeight / 2, shapeWidth, shapeHeight);
                break;
            case 2: // Triangle
                ctx.beginPath();
                ctx.moveTo(x, y - shapeHeight / 2);
                ctx.lineTo(x + shapeWidth / 2, y + shapeHeight / 2);
                ctx.lineTo(x - shapeWidth / 2, y + shapeHeight / 2);
                ctx.closePath();
                ctx.fill();
                break;
        }
        
        // Draw text
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(primitive.text, x, y);
    });
}

// Check if a point is inside a cloud
function isPointInCloud(x, y, cloud) {
    if (!cloud.active) return false;
    
    // Transform point to cloud's local coordinates
    const dx = x - cloud.x;
    const dy = y - cloud.y;
    
    // Account for rotation
    const rotatedX = dx * Math.cos(-cloud.rotation) - dy * Math.sin(-cloud.rotation);
    const rotatedY = dx * Math.sin(-cloud.rotation) + dy * Math.cos(-cloud.rotation);
    
    // Check shape
    switch(cloud.shape) {
        case 'circle':
            return Math.sqrt(rotatedX * rotatedX + rotatedY * rotatedY) <= cloud.size;
            
        case 'triangle':
            // Simple triangle hit detection
            if (rotatedY > cloud.size) return false;
            if (rotatedY < -cloud.size) return false;
            
            const width = cloud.size * (1 - rotatedY / cloud.size);
            return Math.abs(rotatedX) <= width;
            
        case 'rectangle':
            return Math.abs(rotatedX) <= cloud.size && Math.abs(rotatedY) <= cloud.size/2;
            
        case 'diamond':
            return (Math.abs(rotatedX) / cloud.size + Math.abs(rotatedY) / cloud.size) <= 1;
    }
    
    return false;
}

// Fixed event handler for shooting clouds
function handleCanvasClick(e) {
    // Get click coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if we hit any clouds
    let hitCloud = false;
    
    clouds.forEach(cloud => {
        if (cloud.active && isPointInCloud(x, y, cloud)) {
            // Create explosion at cloud position
            createExplosion(cloud.x, cloud.y, cloud.color);
            
            // Deactivate cloud
            cloud.active = false;
            
            // Add new cloud off-screen
            clouds.push(createCloud());
            
            hitCloud = true;
        }
    });
    
    // If no cloud was hit, create small "miss" effect
    if (!hitCloud) {
        const missColor = 'rgba(255, 255, 255, 0.7)';
        
        // Create smaller explosion for miss effect
        const missExplosion = {
            x: x,
            y: y,
            particles: [],
            age: 0
        };
        
        // Add fewer particles for miss effect
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
    
    // Prevent default behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();
}

// Directly attach click event to canvas, and also handle touch events for mobile
canvas.addEventListener('click', handleCanvasClick);
canvas.addEventListener('touchstart', function(e) {
    // Convert touch event to equivalent mouse event
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('click', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    handleCanvasClick(mouseEvent);
    e.preventDefault(); // Prevent scrolling on mobile
}, false);

// Animation loop with timestamp for smooth animation
let lastTime = 0;
function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update wave offset
    wave.offset += wave.speed;
    
    // Draw scene elements
    drawSky();
    drawSun();
    drawClouds();
    drawHorizon();
    drawTextPrimitives();
    drawExplosions();
    
    // Update clouds position smoothly based on delta time
    clouds.forEach(cloud => {
        if (cloud.active) {
            // Move cloud to the left
            cloud.x -= cloud.speed * (deltaTime / 16);
            
            // Rotate if it has rotation speed
            cloud.rotation += cloud.rotationSpeed * (deltaTime / 16);
            
            // Reset cloud position when it goes off screen
            if (cloud.x + cloud.size < -100) {
                cloud.x = canvas.width + cloud.size * 2;
                cloud.y = Math.random() * canvas.height * 0.4;
                cloud.size = 30 + Math.random() * 40;
                cloud.shape = primitiveShapes[Math.floor(Math.random() * primitiveShapes.length)];
            }
        }
    });
    
    // Update grass tufts if needed
    if (grassTufts.length > 0) {
        grassTufts.forEach(tuft => {
            tuft.baseY = canvas.height * 0.6 + Math.sin((tuft.x * wave.frequency) + wave.offset) * wave.amplitude;
        });
    }
    
    // Continue animation
    requestAnimationFrame(animate);
}

// Initialize
requestAnimationFrame(animate);

// Reset grass tufts on resize
window.addEventListener('resize', () => {
    grassTufts.length = 0;
    sun.x = canvas.width * 0.85;
    sun.y = canvas.height * 0.2;
});

// Countdown timer
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
