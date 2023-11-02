class Time {
  constructor(startYear) {
    this.node = document.createElement('div');
    this.year = startYear;
    this.month = 0;

    this.yearDuration = 1000; //ms
    this.monthDuration = this.yearDuration / 12; //ms

    this.call1month = [];
    this.call1years = [];
    this.call5years = [];
  }

  async progressMonth() {
    await Utils.wait(this.monthDuration);
    this.month++;
    if(this.month >= 12) {
      this.month = 0;
      this.year++;
      this.node.dispatchEvent(new CustomEvent('year-passed', {detail: {year: this.year}}));
      await Promise.all(this.call1years.map(fn => fn()));
      if(this.year !== 1975 && this.year % 5 === 0) {
        await Promise.all(this.call5years.map(fn => fn()));
      }
    }
    await Promise.all(this.call1month.map(fn => fn()));
    this.node.dispatchEvent(new CustomEvent('month-passed', {detail: {year: this.year, month: this.month}}));
  }

  async progressYear() {
    for(let i = 0; i < 12; i++) {
      await this.progressMonth();
    }
  }

  async progressYears(years_n_months) {
    const years = Math.floor(years_n_months);
    const months = Math.ceil((years - Math.floor(years)) * 12);
    for(let i = 0; i < years; i++) {
      await this.progressYear();
    }
    for(let i = 0; i < months; i++) {
      await this.progressMonth();
    }
  }

  async awaitMonth() {
    return new Promise((resolve) => {
      this.node.addEventListener('month-passed', function handler(e) {
        this.removeEventListener('month-passed', handler);
        resolve();
      });
    });
  }

  async awaitMonths(n) {
    for(let i = 0; i < n; i++) {
      await this.awaitMonth();
    }
  }
}

const theTime = new Time(1975);
