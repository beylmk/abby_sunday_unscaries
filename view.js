(async function(){
  const params=new URLSearchParams(location.search);
  const iso=params.get('date');
  const title=document.getElementById('title');
  const content=document.getElementById('content');
  const markBtn=document.getElementById('markBtn');

  const schedule=await fetch('schedule.json',{cache:'no-store'}).then(r=>r.json());
  const extras={"2025-08-31":"🧪 Test Sunday (Aug 31) — fake page for testing history & navigation","2025-08-24":"🧪 Test Sunday (Aug 24) — another fake page","2025-08-17":"🧪 Test Sunday (Aug 17) — another fake page"};
  const all=Object.assign({}, extras, schedule);

  function pretty(iso){ const d=new Date(iso); return d.toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'}); }
  function isRead(){ return localStorage.getItem('read:'+iso)==='1'; }
  function setRead(flag){ localStorage.setItem('read:'+iso, flag ? '1':'0'); }

  if(!iso || !all[iso]){
    title.textContent="Not found"; content.textContent="No surprise scheduled for this date."; markBtn.style.display='none'; return;
  }

  title.textContent=pretty(iso);
  content.textContent=all[iso];

  function renderButton(){
    if(isRead()){ markBtn.textContent='Unmark as read'; }
    else { markBtn.textContent='Mark as read'; }
  }
  renderButton();
  markBtn.addEventListener('click', ()=>{ setRead(!isRead()); renderButton(); });
})();