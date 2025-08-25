// Tiny confetti burst on load (no libs)
(function(){
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  let W, H, raf, running = true;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const colors = ['#ff595e','#ffca3a','#8ac926','#1982c4','#6a4c93','#ff9a9e','#fbc2eb','#a1c4fd'];
  const TAU = Math.PI * 2;
  const count = 180;
  const gravity = 0.15;
  const drag = 0.005;
  const pieces = Array.from({length: count}, () => {
    const angle = Math.random() * TAU;
    const speed = 6 + Math.random() * 6;
    return {
      x: W/2, y: H*0.25,
      vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed - 2,
      w: 6 + Math.random()*8, h: 10 + Math.random()*14,
      rot: Math.random()*TAU, vr: (Math.random()-0.5)*0.2,
      color: colors[(Math.random()*colors.length)|0],
      tilt: Math.random()*TAU, vt: (Math.random()*0.2)+0.05, // flip
      alpha: 1
    };
  });

  let t0 = performance.now();
  function tick(t){
    const dt = Math.min(32, t - t0); // cap
    t0 = t;
    ctx.clearRect(0,0,W,H);
    for (const p of pieces){
      // physics
      p.vx *= (1 - drag);
      p.vy += gravity * (dt/16);
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.tilt += p.vt;
      // fade out near bottom
      if (p.y > H - 30) p.alpha -= 0.02;
      // draw
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const scaleY = Math.sin(p.tilt); // paper flip shimmer
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2 * scaleY, p.w, p.h * Math.max(0.2, Math.abs(scaleY)));
      ctx.restore();
    }
    // stop after 10s
    if (t - pieces[0].born > 10000 || pieces.every(p => p.alpha <= 0)) running = false;
    if (running) raf = requestAnimationFrame(tick);
  }
  // mark birth time
  for (const p of pieces) p.born = performance.now();
  raf = requestAnimationFrame(tick);
})();