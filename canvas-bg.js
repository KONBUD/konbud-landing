(function () {
  const canvas = document.getElementById('trails-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Geometric directions: 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°
  const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315].map(d => d * Math.PI / 180);

  function generatePath() {
    const margin = 60;
    const startX = margin + Math.random() * (W - margin * 2);
    const startY = margin + Math.random() * (H - margin * 2);

    const points = [{ x: startX, y: startY }];
    let cx = startX, cy = startY;
    const segments = 2 + Math.floor(Math.random() * 2); // 2–3 segments

    for (let i = 0; i < segments; i++) {
      const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)];
      const len   = 80 + Math.random() * 220;
      cx += Math.cos(angle) * len;
      cy += Math.sin(angle) * len;
      points.push({ x: cx, y: cy });
    }
    return points;
  }

  class Trail {
    constructor() {
      this.path    = generatePath();
      this.t       = 0;
      this.speed   = 0.0022 + Math.random() * 0.0028;
      this.history = [];
      this.maxLen  = 55 + Math.floor(Math.random() * 35);
      this.alive   = true;
    }

    getPos() {
      const segs = this.path.length - 1;
      const tps  = 1 / segs;
      const idx  = Math.min(Math.floor(this.t / tps), segs - 1);
      const segT = (this.t - idx * tps) / tps;
      const p1   = this.path[idx];
      const p2   = this.path[idx + 1];
      return { x: p1.x + (p2.x - p1.x) * segT, y: p1.y + (p2.y - p1.y) * segT };
    }

    update() {
      if (this.t < 1) {
        this.t = Math.min(1, this.t + this.speed);
        this.history.push(this.getPos());
      } else {
        // Head done — drain the tail
        if (this.history.length > 0) this.history.shift();
        else this.alive = false;
      }
      if (this.history.length > this.maxLen) this.history.shift();
    }

    draw() {
      if (this.history.length < 2) return;

      // Trail segments with fading alpha
      for (let i = 1; i < this.history.length; i++) {
        const progress = i / this.history.length;
        const alpha    = progress * 0.42;
        ctx.beginPath();
        ctx.moveTo(this.history[i - 1].x, this.history[i - 1].y);
        ctx.lineTo(this.history[i].x,     this.history[i].y);
        ctx.strokeStyle = `rgba(249,115,22,${alpha})`;
        ctx.lineWidth   = 1.1;
        ctx.stroke();
      }

      // Glowing head (only while still moving)
      if (this.t < 1) {
        const head = this.history[this.history.length - 1];

        // Outer glow
        const grd = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 9);
        grd.addColorStop(0, 'rgba(249,115,22,0.35)');
        grd.addColorStop(1, 'rgba(249,115,22,0)');
        ctx.beginPath();
        ctx.arc(head.x, head.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(head.x, head.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(249,115,22,0.92)';
        ctx.fill();
      }
    }
  }

  const trails = [];
  let lastSpawn    = 0;
  let nextInterval = 3500;

  function activeCount() {
    return trails.filter(t => t.alive).length;
  }

  let canvasDirty = false;

  function loop(now) {
    // Spawn
    if (now - lastSpawn > nextInterval && activeCount() < 3) {
      trails.push(new Trail());
      lastSpawn    = now;
      nextInterval = 3800 + Math.random() * 4200;
    }

    if (trails.length > 0) {
      ctx.clearRect(0, 0, W, H);
      canvasDirty = true;

      // Update & draw
      for (let i = trails.length - 1; i >= 0; i--) {
        trails[i].update();
        trails[i].draw();
        if (!trails[i].alive) trails.splice(i, 1);
      }
    } else if (canvasDirty) {
      // Último clear tras morir el último trail; luego el loop queda ocioso
      ctx.clearRect(0, 0, W, H);
      canvasDirty = false;
    }

    requestAnimationFrame(loop);
  }

  // Initial stagger — spawn first trail after 1.5 s
  setTimeout(() => {
    trails.push(new Trail());
    lastSpawn = performance.now();
    requestAnimationFrame(loop);
  }, 1500);
})();
