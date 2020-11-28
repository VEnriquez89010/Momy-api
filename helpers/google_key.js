
module.exports = {
    CLIENT_ID :'client_id.apps.googleusercontent.com', 
    PROJECT_ID :'app-192100', 
    AUTH_URL :'https://accounts.google.com/o/oauth2/auth',
    TOKEN_URI:'https://oauth2.googleapis.com/token',
    AUTH_PROVIDER_X509_CERT_URL :'https://www.googleapis.com/oauth2/v1/certs',
    CLIENT_SECRET :'SECRET_FROM_API', 
    REDIRECT_URIS:['http://178.128.3.59:8080/google/callback'],
    JAVASCRIPT_ORIGINS :['http://178.128.3.59:8080'],
    USERINFO_PROFILE_ULR: 'https://www.googleapis.com/auth/userinfo.profile',
    USERINFO_GMAIL_URL: 'https://www.googleapis.com/auth/gmail.readonly',
    USERINFO_ME_URL: 'https://www.googleapis.com/userinfo/v2/me'
}
