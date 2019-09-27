require('dotenv').config();

const path = require('path');
const express = require('express');
const expressSession = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const authRouter = require('./auth');

const app = express();
const port = process.env.PORT || 8000;

// App views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// App instance, port declaration, and session definitions
const session = {
  secret: 'LoxodontaElephasMammuthusPalaeoloxodonPrimelephas',
  cookie: {},
  resave: false,
  saveUninitialized: false,
};

const strategy = new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
},
  function (accessToken, refreshToken, extraParams, profile, done) {
  /**
     * Access tokens are used to authorize users to an API 
     * (resource server)
     * accessToken is the token to call the Auth0 API 
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  }
);

// Production check for cookie config
if(app.get('env') === 'production') {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// App and passport settings
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Mount auth router
app.use('/', authRouter);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route controllers
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/user', (req, res) => {
  res.render('user', { title: 'Profile', userProfile: { nickname: 'Auth0'}});
});

// App listening
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});