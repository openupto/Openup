import { useEffect, useRef } from 'react';

interface FuturisticBackgroundProps {
  theme: string;
  className?: string;
}

export function FuturisticBackground({ theme, className = '' }: FuturisticBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        if (theme === 'neon') {
          ctx.fillStyle = `rgba(0, 255, 136, ${particle.opacity})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ff88';
        } else if (theme === 'cyber') {
          ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#00ffff';
        } else {
          ctx.fillStyle = `rgba(0, 110, 247, ${particle.opacity})`;
          ctx.shadowBlur = 5;
          ctx.shadowColor = '#006EF7';
        }
        
        ctx.fill();
        
        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              
              const lineOpacity = (100 - distance) / 100 * 0.1;
              if (theme === 'neon') {
                ctx.strokeStyle = `rgba(0, 255, 136, ${lineOpacity})`;
              } else if (theme === 'cyber') {
                ctx.strokeStyle = `rgba(0, 255, 255, ${lineOpacity})`;
              } else {
                ctx.strokeStyle = `rgba(51, 153, 255, ${lineOpacity})`;
              }
              
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  if (theme === 'minimal' || theme === 'dark') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}