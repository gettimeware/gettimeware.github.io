class Star {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.z = Math.random() * 1500;
        this.size = Math.random() * 1.5 + 0.5;
        this.speed = Math.random() * 0.02 + 0.01;
        this.twinkle = Math.random() * 0.05;
    }

    update() {
        this.z -= this.speed;
        if (this.z <= 0) this.reset();
        this.x += (this.x - this.canvas.width/2) * this.speed * 0.1;
        this.y += (this.y - this.canvas.height/2) * this.speed * 0.1;
    }

    draw() {
        const scale = 1000 / (1000 + this.z);
        const alpha = 0.5 + Math.sin(Date.now() * this.twinkle) * 0.3;
        
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.arc(
            (this.x - this.canvas.width/2) * scale + this.canvas.width/2,
            (this.y - this.canvas.height/2) * scale + this.canvas.height/2,
            this.size * scale,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }
}

const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

// Setup canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Create stars
const stars = Array.from({ length: 200 }, () => new Star(canvas));

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(11, 10, 24, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();
