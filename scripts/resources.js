(function() {
  const el = document.querySelector('.resources');
  const fields = {
    'month': el.querySelector('[data-name="Month"]'),
    'year': el.querySelector('[data-name="Year"]'),
    'money': el.querySelector('[data-name="UVR"]'),
  };

  fields.year.textContent = theTime.year;
  fields.month.textContent = Utils.getMonthName(theTime.month);

  theTime.node.addEventListener('month-passed', function(e) {
    fields.month.textContent = Utils.getMonthName(theTime.month);
  });
  theTime.node.addEventListener('year-passed', function(e) {
    fields.year.textContent = theTime.year;
  });
})();
