const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      if(e.target.classList.contains('process-steps')) e.target.classList.add('run');
    }
  })
},{threshold:.14, rootMargin:'0px 0px -6% 0px'});

document.querySelectorAll('.reveal,.process-steps').forEach((el,idx)=>{
  if(el.closest('.stagger')){
    const siblings=[...el.parentElement.children];
    el.style.transitionDelay = `${siblings.indexOf(el)*90}ms`;
  }else if(el.classList.contains('reveal')){
    el.style.transitionDelay = `${Math.min(idx%3,2)*70}ms`;
  }
  io.observe(el);
});

document.querySelectorAll('.stagger > *').forEach(el=>{
  el.classList.add('reveal');
  io.observe(el);
});

const modal=document.getElementById('qrModal');
document.querySelectorAll('[data-open-qr]').forEach(b=>b.addEventListener('click',()=>modal.classList.add('open')));
document.querySelectorAll('[data-close-qr]').forEach(b=>b.addEventListener('click',()=>modal.classList.remove('open')));
modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});

document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.remove('open')});

if(!prefersReduced){
  const progress=document.querySelector('.scroll-progress');
  const parallaxImgs=[...document.querySelectorAll('.parallax-img')];
  const heroCopy=document.querySelector('.hero-copy');
  let ticking=false;
  const onScroll=()=>{
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(()=>{
      const y=window.scrollY;
      const max=document.documentElement.scrollHeight-window.innerHeight;
      progress.style.transform=`scaleX(${Math.max(0,Math.min(1,y/max))})`;
      if(heroCopy){
        const v=Math.min(1,y/(window.innerHeight*.9));
        heroCopy.style.transform=`translateY(${v*34}px)`;
        heroCopy.style.opacity=String(1-v*.58);
      }
      parallaxImgs.forEach(img=>{
        const rect=img.parentElement.getBoundingClientRect();
        const speed=parseFloat(img.dataset.speed||.14);
        const offset=(window.innerHeight/2-rect.top-rect.height/2)*speed;
        img.style.transform=`translate3d(0,${offset}px,0) scale(1.08)`;
      });
      ticking=false;
    });
  };
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  document.querySelectorAll('.tilt').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${-y*4}deg) rotateY(${x*5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
}
