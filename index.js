const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 8000;

// App views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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