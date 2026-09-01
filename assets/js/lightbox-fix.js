document.addEventListener('DOMContentLoaded', function () {
  // Listen for Escape key globally to close GLightbox preview
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const gContainer = document.querySelector('.glightbox-container');
      if (gContainer && !gContainer.classList.contains('gclean')) {
        const closeBtn = gContainer.querySelector('.gclose, .glightbox-close');
        if (closeBtn) {
          closeBtn.click();
        }
      }
    }
  });

  // Observe DOM for GLightbox container creation to enforce accessibility and ESC listener
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1 && node.classList && node.classList.contains('glightbox-container')) {
          node.setAttribute('tabindex', '-1');
          node.focus();
        }
      });
    });
  });

  observer.observe(document.body, { childList: true });
});
