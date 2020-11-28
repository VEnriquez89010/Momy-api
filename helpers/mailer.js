var nodemailer = require('nodemailer');
const Crypt = require('../helpers/crypt');
var appSettings = require('./app-settings');
var password = ""//Crypt.decryptAES(appSettings.MAIL_PASSWORD);

var gmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: appSettings.MAIL_FROM,
        pass: password
    }
});

module.exports = gmail;
