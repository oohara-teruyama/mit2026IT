const bgm = document.getElementById('bgm');

// 前のページで再生中だったか確認
const wasPlaying = sessionStorage.getItem('bgmPlaying') === 'true';
const savedTime = parseFloat(sessionStorage.getItem('bgmTime') || '0');

// 再生位置を復元
bgm.currentTime = savedTime;

if (wasPlaying !== false) {
  bgm.play().catch(() => {
    // ブラウザのAutoplay制限でブロックされた場合
    document.addEventListener('click', () => bgm.play(), { once: true });
  });
}

// ページ離脱前に状態を保存
window.addEventListener('pagehide', () => {
  sessionStorage.setItem('bgmPlaying', !bgm.paused);
  sessionStorage.setItem('bgmTime', bgm.currentTime);
});