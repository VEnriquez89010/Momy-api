var express = require('express');
var router = express.Router();
require("../models/user");
const mongoose = require('mongoose');
const Crypt = require('../helpers/crypt');
const User = mongoose.model('User');
var hbsmailer = require("../helpers/mailer");
var emailUtil = require('../views/email');
var appSettings = require('../helpers/app-settings');
const middleware = require('../helpers/middleware');

router.get('/', (req, res) => {
    res.send('Users');
});

router.get('/id/:Id', middleware, (req, res) => {
    var id =  Crypt.decryptAES(req.params.Id);

    User.findOne({ _id: id }).then(result => {
        let user = result.toJSON()
        user.Id = Crypt.encryptAES(result._id);
        res.send(user);
    }, err => res.send(err.message));
});

router.get('/external-login/:Id', (req, res) => {
    var id =  Crypt.decryptAES(req.params.Id);

    User.findOne({ _id: id }).then(result => {
        let user = result.toJSON()
        user.Id = Crypt.encryptAES(result._id);
        const token = jwt.sign({ check:  true }, appSettings.CRYPTO_SECRET_SHA256, { expiresIn: "7d" });       
        res.send({user: user, token: token});
    }, err => res.send(err.message));
});

router.get('/all', middleware, (req, res) => {
    User.find().then(result => {
        res.send(result);
    }, err => res.send(err.message));
});

router.post('/validate-mail', (req, res) => {
    if(req.body.Email){
        User.findOne({Email: req.body.Email}).then(result => {
            (result) ? res.json({Available: false}) : res.json({Available: true});
        }, err => res.json(err.message));
    }else{
        res.status(400);
    }
});

router.put('/', (req, res) => {
    var id = req.params.Id;

    let newUser = {
        Email: req.body.email,
        Name: req.body.name,
        Password: Crypt.encryptSHA(req.body.password),
        Image: req.body.image,
        Phone: Number.parseInt(req.body.phone)
    }

    User.updateOne({ _id: id }, { $set: newUser }).then(user => {
        var out = (user) ? 'User Updated' : 'Failed';
        res.send(out);
    }, err => res.send(err.message));
});

router.post('/add', (req, res) => {
    let newUser = {
        Email: req.body.Email,
        Name: req.body.Name,
        Password: Crypt.encryptSHA(req.body.Password)
    }

    if(newUser.Email){
        User.create(newUser).then(result => {
            let user= result.toJSON();
            user.id = Crypt.encryptAES(result._id);
            res.status(200).json({ message: 'OK', user: user});
        }, err => res.json(err.message));
    }else{
        res.status(404)
    }
});

router.delete('/:Id', middleware, (req, res) => {
    var id = Crypt.decryptAES(req.params.Id);
    User.deleteOne({ _id: id }).then(user => {
        var out = (user) ? 'Deleted ' : 'Error';
        res.send(out);
    }, err => res.send(err.message));
});

router.post('/password-recover', function(req, res, next) {
    const email = req.body.Email;

    if(email){
        User.findOne({ Email: email }).then(user => {
            if (user){
                hbsmailer.sendMail({
                from: appSettings.MAIL_FROM,
                to: user.Email,
                subject: `${appSettings.MAIL_SUBJECT} ${user.Name}`,
                html: emailUtil.template(user)
              }, function (error, response) {
                console.log(error);
                console.log(response);
                console.log('mail sent to: ' + email);
                hbsmailer.close();
                res.json( { message: `Enviado: ${email}`, status: 200});
              });
            }else{
                console.log(`No se encontro usuario con email: ${email}`)
                res.json( { message:`No se encontro usuario con email: ${email}`, status: 404});
            }
        }, err => res.send(err.message));
    }else{
        res.json( { message:`Introduzca un email`, status: 404});
    }
  });

  router.post('/restore-password', (req, res) => {
    const id = Crypt.decryptAES(req.body.Id);
    const pass = req.body.Password;

    User.findOne({ _id: id }).then(user => {
        user.Password = Crypt.encryptSHA(pass);
        user.save();
        res.json({message: 'succes'}).status(201);
    }, err => res.send(err.message));
});

module.exports = router;