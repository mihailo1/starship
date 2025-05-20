"use client";
import React, { useRef, useEffect } from "react";

const NUM_PARTICLES = 1500;

class Particle {
  radius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  initialVx: number;
  initialVy: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.radius = Math.random() * 3 + 1;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.initialVx = this.vx;
    this.initialVy = this.vy;
    this.color = `rgba(255,255,255,${Math.random()})`;
  }

  update(
    mouse: { x: number | null; y: number | null },
    canvasWidth: number,
    canvasHeight: number
  ) {
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = -5000 / (distance * distance + 100);
      const ax = (dx / (distance || 1)) * force;
      const ay = (dy / (distance || 1)) * force;

      const maxAccel = 0.05;
      const cappedAx = Math.max(Math.min(ax * 0.1, maxAccel), -maxAccel);
      const cappedAy = Math.max(Math.min(ay * 0.1, maxAccel), -maxAccel);

      this.vx += cappedAx;
      this.vy += cappedAy;

      const initialSpeed = Math.sqrt(
        this.initialVx * this.initialVx + this.initialVy * this.initialVy
      );
      const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (currentSpeed > initialSpeed) {
        const scale = initialSpeed / currentSpeed;
        this.vx *= scale;
        this.vy *= scale;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
    if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const Particles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from(
      { length: NUM_PARTICLES },
      () => new Particle(canvas.width, canvas.height)
    );

    const animate = () => {
      ctx.fillStyle = "rgba(17, 17, 17, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.update(mouseRef.current, canvas.width, canvas.height);
        p.draw(ctx);
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particles-canvas"
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-auto"
    />
  );
};



export default Particles;
