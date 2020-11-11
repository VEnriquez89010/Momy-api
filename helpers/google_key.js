
module.exports = {
    CLIENT_ID :'542508605229-r3j9v2ohi3vcaflqmk737369fc4aabcl.apps.googleusercontent.com', // '1073554132924-34ffesumsil239aom20m3e864kaqcq5t.apps.googleusercontent.com',
    PROJECT_ID :'securepassword-192100', //'rooeda-268720',
    AUTH_URL :'https://accounts.google.com/o/oauth2/auth',
    TOKEN_URI:'https://oauth2.googleapis.com/token',
    AUTH_PROVIDER_X509_CERT_URL :'https://www.googleapis.com/oauth2/v1/certs',
    CLIENT_SECRET :'S1xyekLa3jOMp6iP0CcxXJ3d', //'R9MhaM-w6Z-IH09Qb3tZqd-m',
    REDIRECT_URIS:['http://localhost:4000/google/callback'],
    JAVASCRIPT_ORIGINS :['http://localhost:4000'],
    USERINFO_PROFILE_ULR: 'https://www.googleapis.com/auth/userinfo.profile',
    USERINFO_GMAIL_URL: 'https://www.googleapis.com/auth/gmail.readonly',
    USERINFO_ME_URL: 'https://www.googleapis.com/userinfo/v2/me'
}
//const url = 'https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/gmail.readonly&response_type=code&client_id=542508605229-r3j9v2ohi3vcaflqmk737369fc4aabcl.apps.googleusercontent.com&redirect_uri=https://rooeda.com:8080/google/callback';
