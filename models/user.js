var mongoose = require('mongoose');
var appSettings  = require('../models/app-settings');
mongoose.connect(appSettings.MONGO_CONNECTION_STRING,  {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let User = new Schema({
    Id: ObjectId,
    Email: { type: String },
    Name: { type: String, required: true },
    Password: { type: String, required: true },
    Created: { type: Date, default: Date.now },
    IsActive: { type: Boolean, default: 1 }
});

module.exports = mongoose.model('User', User);