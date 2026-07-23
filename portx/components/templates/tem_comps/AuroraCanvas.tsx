"use client";

import { useEffect, useRef } from "react";

export function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Dynamic gradient nodes for 3D fluid motion
    const nodes = [
      { x: width * 0.2, y: height * 0.2, vx: 0.5, vy: 0.3, radius: 450, color: "rgba(34, 211, 238, " },
      { x: width * 0.8, y: height * 0.3, vx: -0.4, vy: 0.4, radius: 500, color: "rgba(139, 92, 246, " },
      { x: width * 0.5, y: height * 0.7, vx: 0.3, vy: -0.5, radius: 550, color: "rgba(236, 72, 153, " },
    ];

    let t = 0;

    const render = () => {
      t += 0.005;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      nodes.forEach((node, i) => {
        // Floating movement
        node.x += Math.sin(t + i) * 0.8 + node.vx;
        node.y += Math.cos(t + i * 2) * 0.8 + node.vy;

        // Bounce boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius
        );

        const alpha = 0.18 + Math.sin(t * 2 + i) * 0.05;
        gradient.addColorStop(0, `${node.color}${alpha})`);
        gradient.addColorStop(0.5, `${node.color}${alpha * 0.4})`);
        gradient.addColorStop(1, `${node.color}0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-80"
    />
  );
}