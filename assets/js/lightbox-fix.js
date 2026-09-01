(function () {
  function forceCloseGLightbox() {
    const gContainers = document.querySelectorAll('.glightbox-container');
    if (!gContainers.length) return;

    gContainers.forEach((container) => {
      // 1. Trigger close button clicks
      const closeButtons = container.querySelectorAll('.gclose, .glightbox-close, .gbtn.gclose, [aria-label="Close"]');
      closeButtons.forEach((btn) => {
        try {
          btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          if (typeof btn.click === 'function') btn.click();
        } catch (err) {}
      });

      // 2. Trigger overlay click
      const overlay = container.querySelector('.goverlay');
      if (overlay) {
        try {
          overlay.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          if (typeof overlay.click === 'function') overlay.click();
        } catch (err) {}
      }

      // 3. Fallback: Force clean DOM removal if still present
      container.classList.add('gclean');
      setTimeout(() => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }, 100);
    });

    document.body.classList.remove('glightbox-open');
    document.documentElement.classList.remove('glightbox-open');
    document.body.style.overflow = '';
  }

  function onKeyPress(e) {
    if (e.key === 'Escape' || e.code === 'Escape' || e.keyCode === 27) {
      forceCloseGLightbox();
    }
  }

  // Bind capturing event listeners on window and document
  window.addEventListener('keydown', onKeyPress, true);
  window.addEventListener('keyup', onKeyPress, true);
  document.addEventListener('keydown', onKeyPress, true);
  document.addEventListener('keyup', onKeyPress, true);
})();
