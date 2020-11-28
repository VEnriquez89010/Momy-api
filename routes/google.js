const { google } = require('googleapis');
const axios = require('axios');
const express = require('express')
const googleSettings = require('../helpers/google_key.js');
const Crypt = require('../helpers/crypt');
require("../models/user");
const mongoose = require('mongoose');
const User = mongoose.model('User');
var appSettings  = require('../helpers/app-settings');
var router = express.Router();

const CLIENT_ID = googleSettings.CLIENT_ID;
const CLIENT_SECRET = googleSettings.CLIENT_SECRET;
const REDIRECT_URL = googleSettings.REDIRECT_URIS;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

router.get('/', (req, res) => {
    const defaultScope = [ googleSettings.USERINFO_PROFILE_ULR, googleSettings.USERINFO_GMAIL_URL ];
    const url = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: defaultScope });

    res.redirect(url);
})

router.get('/callback', function (req, res) {
    const code = req.query.code
    if (code) {
        oAuth2Client.getToken(code, function( err, tokens ) {
            if (err) {
                console.log('Error authenticating');
            } else {
                console.log('Successfully authenticated');
                oAuth2Client.setCredentials(tokens);
                let config = { headers: { Authorization: `Bearer ${oAuth2Client.credentials.access_token}` }}

                axios.get(googleSettings.USERINFO_ME_URL, config)
                .then( response => {
                    var gmail = google.gmail({ auth: oAuth2Client, version: 'v1' });
                
                    gmail.users.getProfile({ auth: oAuth2Client, userId: 'me' },
                     function ( err, result ) {
                            if (err) {
                                console.log(err);
                            } else {
                                User.findOne({ Email: result.data.emailAddress }).then(user => {
                                    let newUser = {
                                        Email: result.data.emailAddress,
                                        Name: response.data.name,
                                        Password: Crypt.encryptSHA(response.data.id),
                                        Image: response.data.picture
                                    } 
                                    
                                    if (!user) {
                                        User.create(newUser).then(result => {
                                            res.redirect(`${appSettings.CLIENT_IP}/redirect/${Crypt.encryptAES(result._id)}`);
                                        }, err => res.send(err.message));
                                    }
                                    
                                    res.redirect(`${appSettings.CLIENT_IP}/redirect/${Crypt.encryptAES(user._id)}`);
                                }, err => res.send(err.message));
                            }
                        });
                }).catch(error => console.log(error));
            }
        });
    }
});

module.exports = router;

