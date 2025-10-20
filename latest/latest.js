(function(){
  const articles = [
    { id:1, title:"Verstappen dominates in wet Grand Prix", excerpt:"A commanding drive in tricky conditions gave Verstappen another victory.", date:"2025-07-13", category:"formula1", img:"https://via.placeholder.com/640x360?text=F1+Race" },
    { id:2, title:"Bagnaia wins dramatic MotoGP finale", excerpt:"A last-lap pass sealed an unforgettable win.", date:"2025-08-04", category:"motogp", img:"https://via.placeholder.com/640x360?text=MotoGP" },
    { id:3, title:"Ogier sets fastest time on day two", excerpt:"Tight stages left spectators on the edge of their seats.", date:"2025-09-10", category:"wrc", img:"https://via.placeholder.com/640x360?text=WRC" },
    { id:4, title:"Indy Lights rookie grabs first podium", excerpt:"A breakthrough weekend for the championship hopeful.", date:"2025-06-21", category:"indylights", img:"https://via.placeholder.com/640x360?text=Indy+Lights" },
    { id:4, title:"Practice surprises in qualifying", excerpt:"Unexpected pace from a midfield team shakes up the grid.", date:"2025-07-12", category:"formula1", img:"https://via.placeholder.com/640x360?text=F1+Quali" },
    { id:6, title:"Tech: How teams prepare for wet races", excerpt:"An inside look at setup changes when rain is forecast.", date:"2025-05-28", category:"formula1", img:"https://via.placeholder.com/640x360?text=Tech" }
  ];

  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const controls = Array.from(document.querySelectorAll('.controls [data-cat]'));
  const currentLabel = document.getElementById('currentLabel');

  function render(list){
    grid.innerHTML = '';
    if(!list.length){
      empty.style.display = '';
      return;
    }
    empty.style.display = 'none';
    const frag = document.createDocumentFragment();
    list.forEach(a => {
      const el = document.createElement('article');
      el.className = 'card';
      el.setAttribute('role','listitem');
      el.innerHTML = `
        <div class="thumb">
          <img src="${a.img}" alt="${escapeHtml(a.title)}" style="width:100%;height:100%;object-fit:cover;display:block" />
        </div>
        <div class="meta">
          <div class="tag">${a.category.toUpperCase()}</div>
          <div style="margin-left:auto;color:var(--muted);font-size:.85rem">${a.date}</div>
        </div>
        <div class="title">${escapeHtml(a.title)}</div>
        <div class="excerpt">${escapeHtml(a.excerpt)}</div>
        <div style="margin-top:auto;display:flex;gap:8px;align-items:center">
          <a href="#" data-id="${a.id}" class="read" style="margin-left:auto;padding:8px 10px;border-radius:8px;background:var(--accent);color:#081020;text-decoration:none;font-weight:600;font-size:.9rem">Read</a>
        </div>
      `;
      frag.appendChild(el);
    });
    grid.appendChild(frag);
  }

  function escapeHtml(s){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

  function getCatFromQuery(){
    try{
      const params = new URLSearchParams(location.search);
      return (params.get('cat')||'all').toLowerCase();
    }catch(e){
      return 'all';
    }
  }

  function applyCategory(cat){
    controls.forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
    currentLabel.textContent = (cat === 'all') ? 'All categories' : (cat[0].toUpperCase() + cat.slice(1).replace(/([a-z])([A-Z])/g,'$1 $2'));
    const filtered = (cat === 'all') ? articles.slice() : articles.filter(a => a.category === cat);
    render(filtered);
  }

  const initial = getCatFromQuery();
  applyCategory(initial);

  controls.forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const cat = btn.dataset.cat;
      const url = new URL(location.href);
      if(cat === 'all') url.searchParams.delete('cat'); else url.searchParams.set('cat', cat);
      history.replaceState({}, '', url.toString());
      applyCategory(cat);
    });
  });

  grid.addEventListener('click', (e)=>{
    const a = e.target.closest('a.read');
    if(!a) return;
    e.preventDefault();
    const id = Number(a.dataset.id);
    const art = articles.find(x=>x.id===id);
    if(!art) return;
    openDetail(art);
  });

  function openDetail(art){
    const modal = document.createElement('div');
    modal.style.position='fixed';
    modal.style.inset=0;
    modal.style.background='linear-gradient(180deg, rgba(2,6,23,0.8), rgba(2,6,23,0.9))';
    modal.style.display='flex';
    modal.style.alignItems='center';
    modal.style.justifyContent='center';
    modal.style.zIndex=9999;
    modal.innerHTML = `
      <div style="max-width:900px;width:92%;background:var(--card);border-radius:10px;padding:16px;color:var(--text);box-shadow:0 8px 40px rgba(0,0,0,0.6);max-height:86vh;overflow:auto">
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px">
          <strong style="font-size:1.05rem">${escapeHtml(art.title)}</strong>
          <div style="margin-left:auto;color:var(--muted)">${art.date}</div>
        </div>
        <div style="margin-bottom:12px;color:var(--muted)">${escapeHtml(art.excerpt)}</div>
        <div style="width:100%;height:220px;background:#020814;border-radius:8px;overflow:hidden;margin-bottom:12px">
          <img src="${art.img}" alt="" style="width:100%;height:100%;object-fit:cover;display:block" />
        </div>
        <div style="color:var(--text);line-height:1.6">
          <p>Full article content placeholder. Replace this block with your real article content or load from server.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac sapien vitae nibh efficitur aliquet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">
          <button id="closeModal" style="padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:var(--text);cursor:pointer">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#closeModal').addEventListener('click', ()=> modal.remove());
    modal.addEventListener('click', (ev)=>{ if(ev.target===modal) modal.remove(); });
  }

  window.addEventListener('popstate', ()=> applyCategory(getCatFromQuery()));
  controls.forEach(b=>b.addEventListener('click', ()=> grid.focus && grid.focus()));
})();
