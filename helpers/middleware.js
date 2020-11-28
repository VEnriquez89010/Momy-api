var express = require('express');
var jwt = require('jsonwebtoken');
var appSettings  = require('../helpers/app-settings');
const protectedRoutes = express.Router(); 

protectedRoutes.use((req, res, next) => {
    const token = req.headers['jwt-key'];
    
    if (token) {
      jwt.verify(token, appSettings.CRYPTO_SECRET_SHA256 , (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token no proveída.' 
      });
    }
 });

 module.exports = protectedRoutes;