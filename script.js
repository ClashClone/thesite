// Interactions, animations, particles, counters, theme, carousel
const $ = (sel, root=document)=>root.querySelector(sel);
const $$ = (sel, root=document)=>[...root.querySelectorAll(sel)];

const menuBtn = $('#menuBtn'); const navLinks = $('#navLinks');
menuBtn?.addEventListener('click', ()=>{
  const open = getComputedStyle(navLinks).display !== 'none';
  navLinks.style.display = open ? 'none':'flex';
});

// Year
$('#year').textContent = new Date().getFullYear();

// Theme
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
$('#themeToggle')?.addEventListener('click', ()=>{
  const mode = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', mode);
  localStorage.setItem('theme', mode);
});

// Intersection reveal
const io = new IntersectionObserver((entries)=>{
  for (const e of entries){
    if (e.isIntersecting){
      e.target.style.opacity='1';
      e.target.style.transform='translateY(0)';
      io.unobserve(e.target);
    }
  }
},{threshold:.15});
$$('.card, .carousel-item, .preview, .milestone, .faq-item').forEach(el=>{
  el.style.opacity='0'; el.style.transform='translateY(16px)';
  el.style.transition='opacity .5s ease, transform .5s ease';
  io.observe(el);
});

// Counters
function animateCount(el){
  const target = Number(el.dataset.count||0);
  const dur = 1000; const t0 = performance.now();
  function tick(now){
    const p = Math.min(1, (now - t0)/dur);
    el.textContent = Math.floor(target * (0.1 + 0.9*p));
    if (p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
$$('.metric .num').forEach(animateCount);

// Carousel buttons
const track = $('#carouselTrack');
$('.carousel .prev')?.addEventListener('click', ()=> track.scrollBy({left:-track.clientWidth*.8, behavior:'smooth'}));
$('.carousel .next')?.addEventListener('click', ()=> track.scrollBy({left: track.clientWidth*.8, behavior:'smooth'}));

// Particles background (tiny, no deps)
const canvas = $('#bgParticles'); const ctx = canvas.getContext('2d');
let W, H, DPR;
function size(){
  DPR = window.devicePixelRatio||1;
  W = canvas.clientWidth = canvas.parentElement.clientWidth;
  H = canvas.clientHeight = canvas.parentElement.clientHeight;
  canvas.width = W * DPR; canvas.height = H * DPR;
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
size(); addEventListener('resize', size);
const N = 80;
const pts = Array.from({length:N}, ()=>({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.2, vy:(Math.random()-.5)*.2, r: Math.random()*2+1 }));
function loop(){
  ctx.clearRect(0,0,W,H);
  for (const p of pts){
    p.x += p.vx; p.y += p.vy;
    if (p.x<0||p.x>W) p.vx*=-1;
    if (p.y<0||p.y>H) p.vy*=-1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle='rgba(124,92,255,.6)'; ctx.fill();
  }
  // links
  for (let i=0;i<N;i++){
    for (let j=i+1;j<N;j++){
      const a=pts[i], b=pts[j];
      const dx=a.x-b.x, dy=a.y-b.y; const d = Math.hypot(dx,dy);
      if (d<120){
        ctx.globalAlpha = (120-d)/120 * .25;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
        ctx.strokeStyle='#24d3ee'; ctx.lineWidth=1; ctx.stroke(); ctx.globalAlpha=1;
      }
    }
  }
  requestAnimationFrame(loop);
}
loop();
