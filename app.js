const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//DB Config
const db = require('./config/database');

//Connect to mongoose
mongoose
  .connect(
    db.mongoURI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log('MongoDB Connnnnected');
  })
  .catch(err => console.log(err));

//Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder //For use public folder
app.use(express.static(path.join(__dirname, 'public')));

//MetodOverride middleware
app.use(methodOverride('_method'));

//For flash Message after edit,  delete  EXPRESS SESSION MIDDLEWARE
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global Variable for message
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

//About Route
app.get('/about', (req, res) => {
  res.render('about');
});

//Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
