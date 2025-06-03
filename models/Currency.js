const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  codeId: String,
  curr_name: String,
  sale_san: Number,
  sale_adn: Number,
  purch_san: Number,
  purch_adn: Number,
});

module.exports = mongoose.model('Currency', currencySchema);
