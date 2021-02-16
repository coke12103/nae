module.exports = class ThemeLoader{
  static load(theme = 'DEFAULT'){
    const base_css = require('!!raw-loader!../css/base.css').default;

    return base_css;
  }
}
