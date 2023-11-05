class History {
  static add(objects, record, category='general') {
    objects.forEach(object => {
      object.history.push({
        year: theTime.year,
        month: theTime.month,
        category,
        record,
      });
    });
  }

  static render(history) {
    let html = '<ul class="object-history">';
    const categoryBacklog = {};
    history.forEach(entry => {
      if(entry.category !== 'general' && entry.category in categoryBacklog && categoryBacklog[entry.category] == entry.record) return;
      categoryBacklog[entry.category] = entry.record;
      html +=`<li class="object-history__record"><strong class="object-history__record-date">${Utils.getMonthName(entry.month)} ${entry.year}</strong> ${entry.record}</li>`;
    });
    html += '</ul>';
    return html;
  }
}
