const passport = require('passport');
const LocalStrategy = require('passport-local');
const initUser = require('../modelo/usuario');
global.connected = 0;
//Init Server
require('./servidor');
initUser.main().then( async(query)=>{
console.log("entra")
    passport.use('local.signin', new LocalStrategy({
        usernameField: 'cedula',
        passwordField: 'password',
        passReqToCallback: true
    },async (req,cedula,password,done)=>{
        query.signin(req,cedula,password,done);
    }));
    passport.use('local.signup', new LocalStrategy({
        usernameField: 'cedula',
        passwordField: 'password',
        passReqToCallback: true
    },async (req,cedula,password,done)=>{
        query.signup(req,cedula,password,done);
    }));    
    passport.use('local.register', new LocalStrategy({
        usernameField: 'cedula',
        passwordField: 'password',
        passReqToCallback: true
    },async (req,cedula,password,done)=>{
        query.signin(req,cedula,password,done);
    }));
    
    await query.serial();
});



