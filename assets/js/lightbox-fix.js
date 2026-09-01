(function () {
  function closeGLightbox() {
    const gContainer = document.querySelector('.glightbox-container');
    if (!gContainer) return;

    // Trigger close via close button mouse event
    const closeBtn = gContainer.querySelector('.gclose, .glightbox-close, [aria-label="Close"]');
    if (closeBtn) {
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
      closeBtn.dispatchEvent(clickEvent);
      if (typeof closeBtn.click === 'function') closeBtn.click();
    }

    // Trigger close via overlay click if close button wasn't found
    const overlay = gContainer.querySelector('.goverlay');
    if (overlay) {
      const overlayEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
      overlay.dispatchEvent(overlayEvent);
    }
  }

  function handleEscape(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      closeGLightbox();
    }
  }

  // Intercept Escape key during CAPTURE phase so no other listener blocks it
  window.addEventListener('keydown', handleEscape, true);
  window.addEventListener('keyup', handleEscape, true);
})();
