module.exports = ({ isProduction, isStandalone }) =>
  !isProduction || isStandalone
    ? `<p style="text-align: center">Don't forget to bundle the JavaScript: <code>yarn run watch</code></p>`
    : '';