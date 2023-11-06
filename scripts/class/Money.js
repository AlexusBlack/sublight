class Money {
  static initialAmount = 1000000;
  static amount = 0;
  static inflation = 0;

  static recalculatedInflation() {
    if(Money.amount < Money.initialAmmount) {
      Money.inflation = 0;
    } else {
      Money.inflation = (Money.amount - Money.initialAmmount) / Money.initialAmmount;
    }
  }

  // government creates money to pay for things
  static create(amount) {
    Money.amount += amount;
    Money.recalculatedInflation();
    return amount;
  }

  // ships spend money
  static destroy(amount) {
    Money.amount -= amount;
    Money.recalculatedInflation();
    return amount;
  }

  // adjust sum by inflation, prices and government services
  static adjustInflation(amount) {
    return amount * (1 + Money.inflation);
  }
}
