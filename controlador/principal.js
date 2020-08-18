const passport = require('passport');
const LocalStrategy = require('passport-local');
const initUser = require('../modelo/usuario');
global.connected = 0;
//Init Server
require('./servidor');
initUser.main().then( async(query)=>{

    passport.use('local.signin', new LocalStrategy({
        usernameField: 'ccms',
        passwordField: 'password',
        passReqToCallback: true
    },async (req,ccms,password,done)=>{
        query.signin(req,ccms,password,done);
    }));

    passport.use('local.ccms', new LocalStrategy({
        usernameField: 'ccms',
        passwordField: 'password',
        passReqToCallback: true
    },async (req,ccms,password,done)=>{
        query.ccms(req,ccms,password,done);
    }));

    passport.use('local.signup', new LocalStrategy({
        usernameField: 'ccms',
        passwordField: 'password',
        passReqToCallback: true
    },async (req,ccms,password,done)=>{
        query.signup(req,ccms,password,done);
    }));    
    
    await query.serial();
});



