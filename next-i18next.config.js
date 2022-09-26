const path = require('path');
module.exports = {
  i18n: {
    locales: ['cz', 'en'],
    localeDetection: false,
    defaultLocale: process.env.DEFAULT_LOCALE,
    localePath: path.resolve('./public/locales'),
  },
};
