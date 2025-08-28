(function(){
  const startInput=document.getElementById('startDate');
  const weeksInput=document.getElementById('weeks');
  const output=document.getElementById('output');
  document.getElementById('generate').addEventListener('click', ()=>{
    const start = new Date(startInput.value);
    if(!start || isNaN(start)) { output.value='Pick a valid start Sunday.'; return; }
    // Force to upcoming/that Sunday (0=Sun)
    const day = start.getDay();
    const sunday = new Date(start);
    sunday.setDate(sunday.getDate() + ((7 - day) % 7));
    const n = Math.max(1, Math.min(60, parseInt(weeksInput.value||'52',10)));
    const obj = {};
    for(let i=0;i<n;i++){
      const d = new Date(sunday); d.setDate(d.getDate() + i*7);
      const iso = d.toISOString().slice(0,10);
      obj[iso] = "TODO: write surprise text…";
    }
    output.value = JSON.stringify(obj, null, 2);
  });
  document.getElementById('download').addEventListener('click', ()=>{
    const blob=new Blob([output.value||"{}"], {type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='schedule.generated.json'; a.click();
    URL.revokeObjectURL(url);
  });
})();