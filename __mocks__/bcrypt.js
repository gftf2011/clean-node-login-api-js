module.exports = {
  isValid: true,
  async compare(value, hashValue) {
    this.value = value;
    this.hashValue = hashValue;
    return this.isValid;
  },
};
