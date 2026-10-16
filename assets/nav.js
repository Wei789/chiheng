/* 手機選單（≤760px）：「選單」按鈕展開／收起直排連結。
   頁首 <head> 先加上 .js；沒有 JS 時按鈕不顯示，連結直接直排可用。桌機版不受影響。 */
(function initMenu(){
  const btn = document.querySelector('.menu-btn');
  const menu = btn && document.getElementById(btn.getAttribute('aria-controls'));
  if (!menu) return;
  const isOpen = () => btn.getAttribute('aria-expanded') === 'true';
  const set = open => { btn.setAttribute('aria-expanded', String(open)); menu.classList.toggle('open', open); };
  btn.addEventListener('click', () => set(!isOpen()));
  /* Esc 收起，焦點回到按鈕 */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen()) { set(false); btn.focus(); }
  });
  /* 點選單外面收起 */
  document.addEventListener('click', e => { if (isOpen() && !e.target.closest('header nav')) set(false); });
})();
