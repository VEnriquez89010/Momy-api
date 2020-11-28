var crypto = require ('crypto');
var appSettings  = require('./app-settings');

module.exports.encryptSHA = (pass) => {
    var hash = crypto.createHmac(appSettings.CRYPTO_ALGORITHM_SHA256, appSettings.CRYPTO_SECRET_SHA256).update(pass).digest(appSettings.CRYPTO_ENCODING_HEX);
    return hash;
}

module.exports.encryptAES = (text) =>{
    let cipher = crypto.createCipheriv(appSettings.CRYPTO_ALGORITHM_AES, appSettings.CRYPTO_SECRET_AES, appSettings.CRYPTO_IV);
    let encrypted = cipher.update(text.toString(), appSettings.CRYPTO_ENCODING_UTF8, appSettings.CRYPTO_ENCODING_HEX);
    encrypted += cipher.final(appSettings.CRYPTO_ENCODING_HEX);
    return encrypted;
  };
  
  module.exports.decryptAES = (encrypted) =>{
    let decipher = crypto.createDecipheriv(appSettings.CRYPTO_ALGORITHM_AES, appSettings.CRYPTO_SECRET_AES, appSettings.CRYPTO_IV);
    let decrypted = decipher.update(encrypted.toString(), appSettings.CRYPTO_ENCODING_HEX, appSettings.CRYPTO_ENCODING_UTF8);
    return (decrypted + decipher.final(appSettings.CRYPTO_ENCODING_UTF8));
  };
  