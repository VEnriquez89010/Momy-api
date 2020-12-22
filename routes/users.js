var express = require('express');
var router = express.Router();
require("../models/user");
const mongoose = require('mongoose');
const Crypt = require('../helpers/crypt');
const User = mongoose.model('User');
var appSettings = require('../helpers/app-settings');
const middleware = require('../helpers/middleware');
var jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, appSettings.INSTRUCTORS_PATH)
  },
    filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file')

router.get('/', (req, res) => {
    res.send('Users');
});

router.get('/id/:Id', middleware, (req, res) => {
    if(!req.params.Id){
        return;
    }

    var id =  Crypt.decryptAES(req.params.Id);

    User.findOne({ _id: id }).then(result => {
        let user = result.toJSON()
        user.Id = Crypt.encryptAES(result._id);
        res.send(user);
    }, err => res.send(err.message));
});

router.get('/all', middleware, (req, res) => {
    User.find().then(result => {
        res.send(result);
    }, err => res.send(err.message));
});

router.post('/add', (req, res) => {
    let newUser = {
        Email: req.body.Email,
        Name: req.body.Name,
        Password: Crypt.encryptSHA(req.body.Password)
    }

    if(req.body.Email != null){
        User.findOne({Email: req.body.Email}).then( userFound => {
            if (userFound != null) {
                res.json({Available: false, User: null, Message:  `El correo ${req.body.Email} ya existe` }) 
            }else{
                User.create(newUser).then(result => {
                    let user= result.toJSON();
                    user.id = Crypt.encryptAES(result._id);
                    const token = jwt.sign({ check:  true }, appSettings.CRYPTO_SECRET_SHA256, { expiresIn: "7d" });
                    res.json({Available: true, User: user, Message:  `Usuario agregado satisfactoriamente`, Token: token }) 
                }, err => res.json(err.message));
            }
        }, err => res.json(err.message));
    }else{
        res.status(404)
    }
});

// CRUD //
// Add
router.put('/', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        let user = JSON.parse(req.body.user);

        let newUser = {
            Email: user.Email,
            Name: user.Name,
            Password: Crypt.encryptSHA(user.Password),
            ImagePath: (req.file) ? `${appSettings.SERVER_IP}/usersPictures/${req.file.filename}`: ''
        }
    
        if(user.Email != null){
            User.findOne({Email: req.body.Email}).then( userFound => {
                if (userFound != null) {
                    res.json({Available: false, User: null, Message:  `El correo ${req.body.Email} ya existe` }) 
                }else{
                    User.create(newUser).then( userResult => {
                        let result= userResult.toJSON();
                        result.id = Crypt.encryptAES(result._id);
                        const token = jwt.sign({ check:  true }, appSettings.CRYPTO_SECRET_SHA256, { expiresIn: "7d" });
                        res.json({Available: true, User: result, Message:  `Usuario agregado satisfactoriamente`, Token: token }) 
                    }, err => res.json(err.message));
                }
            }, err => res.json(err.message));
        }else{
            res.status(404)
        }
    });
});

// Edit
router.put('/:Id', middleware, (req, res) => {
    var id = Crypt.decryptAES(req.params.Id);
    User.findOne({ _id: mongoose.Types.ObjectId(id) }).then( result => {
        if(result){
            upload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(500).json(err)
                } else if (err) {
                    return res.status(500).json(err)
                }
                
                if(req.file && result.ImagePath){
                    let imageName = result.ImagePath.split('/').pop();
                    if(req.file.filename != imageName){
                        fs.unlink(`${appSettings.IMAGE_PATH}${imageName}`, err => (!err) ? console.log(`Image deleted: ${imageName}`) : console.log(err));
                    }
                }
                let user = JSON.parse(req.body.user);
                
                let newUser = {
                    Email: user.Email,
                    Name: user.Name,
                    Password: Crypt.encryptSHA(user.Password),
                    ImagePath: (req.file) ? `${appSettings.SERVER_IP}/usersPictures/${req.file.filename}`: ''
                }
        
                User.updateOne({ _id: mongoose.Types.ObjectId(id)}, { $set: newUser }).then(result => res.json(result).status(200), err => res.json(err.message));
            });
        }else{
            res.send('No encontrado').status(404)
        }
    });
});

// Delete
router.delete('/:Id', middleware, (req, res) => {
    var id = Crypt.decryptAES(req.params.Id);
    User.findOne({ _id: mongoose.Types.ObjectId(id) }).then( result => {
        if(result){
            if(result.ImagePath){
                let imageName = result.ImagePath.split('/').pop();
                fs.unlink(`${appSettings.IMAGE_PATH}${imageName}`, err => (!err) ? console.log(`Image deleted: ${imageName}`) : console.log(err));
            }
            
            User.deleteOne({ _id: mongoose.Types.ObjectId(id) }).then( user => {
                res.send(user).status(200), err => res.send(err.message).status(400);
            });
        }else{
            res.status(404);
        }
    });
});


module.exports = router;