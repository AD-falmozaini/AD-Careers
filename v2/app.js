// AD Careers v2 — light client helpers
(function () {
  // Mobile nav toggle (placeholder for ATS-ready expansion)
  document.querySelectorAll('.nav-burger').forEach(function (b) {
    b.addEventListener('click', function () {
      var nav = document.querySelector('.nav-primary');
      if (!nav) return;
      var open = nav.classList.toggle('open');
      nav.style.display = open ? 'flex' : '';
      if (open) {
        nav.style.position = 'absolute'; nav.style.top = '76px'; nav.style.left = '0';
        nav.style.right = '0'; nav.style.background = '#fff'; nav.style.padding = '16px';
        nav.style.flexDirection = 'column'; nav.style.borderBottom = '1px solid #e4e9e8';
        nav.style.boxShadow = '0 6px 16px rgba(0,60,52,0.1)';
      }
    });
  });

  // Form submit placeholder
  document.querySelectorAll('form[data-prototype]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var label = f.dataset.prototype || 'Form';
      alert(label + ' — prototype only. Connect to SuccessFactors Recruiting / CRM to enable submission.');
    });
  });

  // Save-job toggle
  document.querySelectorAll('[data-save-job]').forEach(function (b) {
    b.addEventListener('click', function () {
      b.classList.toggle('saved');
      b.textContent = b.classList.contains('saved') ? 'Saved' : 'Save job';
    });
  });
})();
