(async function(){
  const list=document.getElementById('historyList');
  const schedule=await fetch('schedule.json',{cache:'no-store'}).then(r=>r.json());
  const extras={"2025-08-31":"🧪 Test Sunday (Aug 31) — fake page for testing history & navigation","2025-08-24":"🧪 Test Sunday (Aug 24) — another fake page","2025-08-17":"🧪 Test Sunday (Aug 17) — another fake page"};
  const all=Object.assign({}, extras, schedule);
  const today=new Date(); today.setHours(0,0,0,0);
  const dates=Object.keys(all).filter(iso=>new Date(iso)<=today).sort();

  function isRead(iso){ return localStorage.getItem('read:'+iso)==='1'; }

  for(const iso of dates){
    const d=new Date(iso);
    const li=document.createElement('li');
    const label=d.toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'});
    const a=document.createElement('a'); a.href=`view.html?date=${iso}`; a.textContent='Open';
    const span=document.createElement('span'); span.textContent=label + (isRead(iso) ? " ✅" : "");
    li.appendChild(span); li.appendChild(a); list.appendChild(li);
  }
})();