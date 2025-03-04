import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
}

const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles.current = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 150);
      
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 0.2,
          dy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const drawParticle = (particle: Particle) => {
      if (!ctx) return;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 220, 255, 0.5)';
      ctx.fill();
    };

    const drawConnections = () => {
      if (!ctx) return;
      
      const connectionDistance = 150;
      
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const dx = particles.current[i].x - particles.current[j].x;
          const dy = particles.current[i].y - particles.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles.current[i].x, particles.current[i].y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            
            // Opacity based on distance
            const opacity = 1 - (distance / connectionDistance);
            ctx.strokeStyle = `rgba(100, 150, 255, ${opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach((particle) => {
        // Update position
        particle.x += particle.dx;
        particle.y += particle.dy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.dx = -particle.dx;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.dy = -particle.dy;
        }
        
        drawParticle(particle);
      });
      
      drawConnections();
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="particles-background"
      aria-hidden="true"
    />
  );
};

export default ParticlesBackground;
