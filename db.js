const mongoose = require('mongoose');
var debug = require('debug')('api:db');

const moongoseConect = async () => {
    await mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    debug('connected to mongodb');
}

module.exports = {moongoseConect};