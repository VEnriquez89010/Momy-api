var express = require('express');
var router = express.Router();
require("../models/user");
const Crypt = require('../helpers/crypt');
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', (req, res) => {
    res.send('sessions')
});

router.post('/login', function(req,res,next){
    var query = { "Email": req.body.Email, "Password": Crypt.encryptSHA(req.body.Password) };

    if(query.Email){
          User.findOne(query).then(result => {
            if (result) {
                let user = result.toJSON();
                user.id = Crypt.encryptAES(user._id);
                res.status(200).json({Message: 'Ok', user: user});
            } else {
                res.status(404).json({Message: 'Not Found'});
            }

        }, err => res.json(err.message));
    }else{
        res.status(404).json({Message: 'Not Found'});
    }
});

module.exports = router;
