<script>
window.addEventListener("load", () => {

  const ring   = document.getElementById("opening-ring");
  const logo   = document.getElementById("opening-logo");
  const nav    = document.querySelector(".global-nav");
  const rsvBtn = document.querySelector(".reserve-btn-sub");

  /* 輪っか表示 */
  ring.classList.add("show");
  setTimeout(()=> ring.classList.add("fadeout"), 2200);

  /* ロゴ表示（中央で固定） */
  setTimeout(()=> logo.classList.add("show"), 2600);
  setTimeout(()=> logo.classList.remove("locked"), 3600);

  /* メニューバー & 予約ボタン表示 */
  setTimeout(()=>{
    nav.classList.add("show");
    rsvBtn.classList.add("show");
  }, 2600);

  /* ★ ロゴ固定解除：ここが最重要（アニメ後はスクロールOK） */
  setTimeout(()=>{
    logo.classList.remove("locked");
  }, 3600);

});

/* スクロールでお知らせ表示 */
window.addEventListener("scroll", ()=>{
  if(window.scrollY > 100){
    document.getElementById("info-card").classList.add("show");
  }
});
</script>
