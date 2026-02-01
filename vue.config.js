// vue.config.js
module.exports = {
  publicPath: process.env.VUE_APP_ENVIRONMENT === 'gh-pages'
    ? '/fe-aydin-todo/' : '/',
};
