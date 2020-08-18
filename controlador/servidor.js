const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors')
const app = express();
const path = require('path');
const https = require('https');
const fs = require('fs');
//Settings
app.set('port', process.env.PORT || 4000)

//Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({ secret: 'zicr3t@*sjf0sm19$)%k%0k3#$' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

//Helmet options
app.disable('x-powered-by');
app.disable('csp');
app.disable('noCache');
app.disable('frameguard');
app.disable('xssFilter');

//Global Variables
app.use((req,res,next)=>{
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require('./rutas'));

//Starting the server
app.listen(app.get('port'), () =>{
    console.log('Server on. Port:', app.get('port'));
})
