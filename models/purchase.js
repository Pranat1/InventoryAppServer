const { intersection } = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    itemId: String,
    quantity: Number,
    pricePer: Number,
    date: String,
    time: String, 
    billNumber: Number
});

module.exports = mongoose.model('Purchase', purchaseSchema);
