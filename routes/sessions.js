var express = require('express');
var router = express.Router();
var appSettings  = require('../helpers/app-settings');
var jwt = require('jsonwebtoken');
require("../models/user");
const Crypt = require('../helpers/crypt');
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', (req, res) => {
   res.send('Login')
});

/* router.post('/login', function(req,res) {
    var query = { "Email": req.body.Email, "Password": Crypt.encryptSHA(req.body.Password) };

    if(query.Email){
          User.findOne(query).then(result => {
            if (result) {
                let user = result.toJSON();
                user.id = Crypt.encryptAES(user._id);
                const token = jwt.sign({ check:  true }, appSettings.CRYPTO_SECRET_SHA256, { expiresIn: "7d" });
                res.status(200).json({Message: 'Ok', user: user, token : token});
            } else {
                res.status(404).json({Message: 'Not Found'});
            }

        }, err => res.json(err.message));
    }else{
        res.status(404).json({Message: 'Not Found'});
    }
}); */

router.post('/login', function(req,res) {
    var query = { "Email": req.body.Email, "Password": Crypt.encryptSHA(req.body.Password) };

    if(query.Email){
          User.findOne(query).then(result => {
            if (result) {
                let user = result.toJSON();
                user.id = Crypt.encryptAES(user._id);
                const token = jwt.sign({ check:  true }, appSettings.CRYPTO_SECRET_SHA256, { expiresIn: "7d" });
                res.status(200).json({Message: 'Ok', user: user, token : token});
            } else {
                res.status(404).json({Message: 'Not Found'});
            }

        }, err => res.json(err.message));
    }else{
        res.status(404).json({Message: 'Not Found'});
    }
});

module.exports = router;
