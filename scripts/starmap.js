let CONF_MAP_ZOOM_SPEED = 0.05;
(function() {
  const el = document.querySelector('.starmap');
  let scale = 355;
  el.style.setProperty('--scale', scale + 'px');
  // start position
  let target = document.getElementById('target');
  target.scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});

  el.addEventListener('wheel', function(e) {
    e.preventDefault();
    let scaleDelta = e.deltaY * CONF_MAP_ZOOM_SPEED;
    let scaleChange = (scale - scaleDelta) / scale;
    if(scale < 20 && scaleDelta > 0) return;
    scale -= scaleDelta;
    el.style.setProperty('--scale', scale + 'px');

    // adjust scroll position to zoom in on the mouse position
    el.scrollLeft *= scaleChange;
    el.scrollTop *= scaleChange;
  });

  // listen to middle mouse to drag
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  el.addEventListener('mousedown', function(e) {
    if (e.button === 1) {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });
  el.addEventListener('mousemove', function(e) {
    if (isDragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      el.scrollLeft -= dx;
      el.scrollTop -= dy;
    }
  });
  el.addEventListener('mouseup', function(e) {
    if (e.button === 1) {
      isDragging = false;
    }
  });
})();
