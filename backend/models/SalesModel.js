// sales.model.js
// unfinish
const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    sales_id: {type: String, required: true},
    product_quantity: {type: Number, required: true},
    total_sales_amount: {type: Number, required: true},
    sales_date: {type: Date, required: true},
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;