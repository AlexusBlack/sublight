class Utils {
  static wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static getMonthName(month) {
    return [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ][month];
  }
}
