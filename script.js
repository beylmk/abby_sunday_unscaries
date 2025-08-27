// Weekly content loader + BIG countdown to next Sunday
(function(){
  const START_ISO = "2025-09-07";
  const TOTAL_WEEKS = 52;

  function toLocalDate(iso){
    const [y,m,d]=iso.split("-").map(Number);
    return new Date(y, m-1, d);
  }

  // ------- Weekly page loader -------
  const start = toLocalDate(START_ISO);
  const now = new Date();

  let weeksPassed = Math.floor((now - start) / (7*24*60*60*1000));
  if (weeksPassed < 0) weeksPassed = 0;
  if (weeksPassed >= TOTAL_WEEKS) weeksPassed = TOTAL_WEEKS - 1;

  const pageIndex = weeksPassed + 1; // 1..52
  const mount = document.getElementById("content");
  fetch(`pages/page-${pageIndex}.html?v=6`, { cache: "no-store" }).then(r=>r.ok?r.text():Promise.reject(r.status))
    .then(html=>{ mount.innerHTML = html; })
    .catch(()=>{ mount.innerHTML = "<p>No page found yet!</p>"; });

  // ------- BIG Countdown to next Sunday (headline) -------
  function getNextSunday() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(0,0,0,0);
    const daysUntilSunday = ((7 - next.getDay()) % 7) || 7; // 0=Sun
    next.setDate(next.getDate() + daysUntilSunday);
    return next;
  }

  function updateCountdown(){
    const el = document.getElementById("countdown");
    const target = getNextSunday();
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      el.textContent = "🎉 It's Sunday! New page unlocked!";
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    el.textContent = `⏳ Next Sunday in ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();