const path = require('path');

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'smartfoodpop_secret_key_popayan_2026',
  SCRAPED_PRODUCTS_PATH: path.join(__dirname, '../../../scraper/output/scraped_products_api.json')
};
