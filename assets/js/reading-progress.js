document.addEventListener('DOMContentLoaded', function () {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  function updateProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
});
