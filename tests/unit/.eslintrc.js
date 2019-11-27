module.exports = {
  env: {
    mocha: true
  },
  rules: {
    quotes: [
      0,
      "single",
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    semi: [0, "never"]
  }
};
