class Helpers {
  static inc(value) {
    return value + 1;
  }

  static parseSection(value) {
    return value == 'FR' ? 'Francophone' : 'Anglophone';
  }
}

module.exports = Helpers;