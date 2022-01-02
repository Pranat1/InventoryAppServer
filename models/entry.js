const { intersection } = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema({
    itemId: String,
    quantity: Number,
    date: String,
    time: String, 
    personId: String,
    placeId: String
});

module.exports = mongoose.model('Entry', entrySchema);
