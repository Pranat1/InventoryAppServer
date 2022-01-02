const { intersection } = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: String,
    unit: String
});

module.exports = mongoose.model('Item', itemSchema);
