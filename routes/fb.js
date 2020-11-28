var express = require ('express');
var router = express.Router();
var rest  = require('../helpers/rest');
const Crypt = require('../helpers/crypt');
var appSettings  = require('../helpers/app-settings');
require("../models/user");
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/',function(req,res,next){
	res.send('FB_Login');
});

router.get('/loginFB',function(req,res,next){
  var redirect_uri = appSettings.FB_REDIRECT_URL;
  res.redirect(`${appSettings.FB_OAUTH_URL}${appSettings.FB_CLIENT_ID}&redirect_uri=${redirect_uri}`);
});

router.get('/facebook_redirect',function(req,res,next){
  //getting facebook data
  	var redirect_uri = appSettings.FB_REDIRECT_URL;
  	var facebook_code = req.query.code;
  	var accesstoken_call = {
  	    host: appSettings.FB_HOST,
  	    port: 443,
  	    path: `/v2.10/oauth/access_token?client_id=${appSettings.FB_CLIENT_ID}&redirect_uri=${redirect_uri}&client_secret=${appSettings.FB_CLIENT_SECRET}&code=${facebook_code}`,
  	    method: 'GET',
		  headers: {'Content-Type': 'application/json'}
		  
  	};

  	rest.getJSON(accesstoken_call, function(statusCode, access_token_response) {
		var FB_path = appSettings.FB_ME_FIELDS+access_token_response.access_token;
  	    var userinfo_call = {
  		    host: appSettings.FB_HOST,
  		    port: 443,
  		    path: FB_path,
  		    method: 'GET',
  		    headers: {'Content-Type': 'application/json'}
  		};
  		rest.getJSON(userinfo_call, function(statusCode, user_info_response) {
              User.findOne({ Name: user_info_response.name  }).then(user => {
                let newUser = {
                    Email: user_info_response.email, //this value is empty
                    Name: user_info_response.name,
                    Password: access_token_response.access_token,
                    Image: user_info_response.picture.data.url
                }

                if (!user) {
					User.create(newUser).then(result => {
						console.log(result);
						res.redirect(`${appSettings.CLIENT_IP}/redirect/${Crypt.encryptAES(result._id)}`);
					}, err => res.send(err.message));
				}

				res.redirect(`${appSettings.CLIENT_IP}/redirect/${Crypt.encryptAES(user._id)}`);
            }, err => res.send(err.message));
  	    });
  	});
});

module.exports = router;
