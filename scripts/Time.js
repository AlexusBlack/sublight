class Time {
  constructor(startYear) {
    this.node = document.createElement('div');
    this.year = startYear;
    this.month = 0;

    this.yearDuration = 3000; //ms
    this.monthDuration = this.yearDuration / 12; //ms
  }

  async progressMonth() {
    await Utils.wait(this.monthDuration);
    this.month++;
    if(this.month >= 12) {
      this.month = 0;
      this.year++;
      this.node.dispatchEvent(new CustomEvent('year-passed', {detail: {year: this.year}}));
    }
    this.node.dispatchEvent(new CustomEvent('month-passed', {detail: {year: this.year, month: this.month}}));
  }

  async progressYear() {
    for(let i = 0; i < 12; i++) {
      await this.progressMonth();
    }
  }

  async progressYears(years) {
    for(let i = 0; i < years; i++) {
      await this.progressYear();
    }
  }
}

const theTime = new Time(1977);
