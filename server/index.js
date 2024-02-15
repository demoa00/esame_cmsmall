'use strict';

const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cors = require('cors');

const custom_validator = require('./custom_validator'); // Validator for page content

const db_images_queries = require('./db_images_queries');
const db_title_queries = require('./db_title_queries');
const db_pages_queries = require('./db_pages_queries');
const db_user_queries = require('./db_users_queries');

////////////////////////
// Passport
////////////////////////

passport.use(new LocalStrategy(
  function (username, password, done) {
    db_user_queries.getUser(username, password).then((user) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username and/or password.' });
      }
      return done(null, user);
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db_user_queries.getUserById(id).then(user => {
    done(null, user); // this will be available in req.user
  }).catch(err => {
    done(err, null);
  });
});

////////////////////////
// Initilization express
////////////////////////

const app = new express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authenticated' });
}

// Custom middleware, for verification of admin privileges
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin == 1)
    return next();

  return res.status(403).json({ error: 'Not enough requirements' });
}

// Set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: "kjwc64iwv543w3kc",   //personalize this random string, should be a secret value
  resave: false,
  saveUninitialized: false
}));

// Init passport
app.use(passport.initialize());
app.use(passport.session());

////////////////////////
// API for images
////////////////////////

// Get images path
app.get('/api/images/path', isLoggedIn, async (req, res) => {
  try {
    const images_path = await db_images_queries.getImagesPath();
    res.json(images_path);
  } catch (err) {
    res.status(500).json({ "error": "Status 500: error in fecth images path" });
  }
});

////////////////////////
// API for title
////////////////////////

// Get title
app.get('/api/title', async (req, res) => {
  try {
    const title = await db_title_queries.getTitle();
    res.json(title);
  } catch (err) {
    res.status(500).json({ "error": "Status 500: error in fecth title" });
  }
});

// Update title
app.put('/api/title', isAdmin, [
  check('title').isLength({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ "errors": errors.array() });
  }

  try {
    const rows_changed = await db_title_queries.updateTitle(req.body.title);
    res.json(rows_changed);
  } catch (err) {
    if (err === 0) {
      res.status(404).json({ "error": "Status 404: title not found" });
    }
    else if (err === 1) {
      res.status(404).json({ "error": "Status 404: author name not found" });
    }
    else {
      res.status(500).json({ "error": "Status 500: error in updating pages" });
    }
  }
});

////////////////////////
// API for pages
////////////////////////

// Get all published pages
app.get('/api/pages/published', async (req, res) => {
  try {
    const pages = await db_pages_queries.getAllPublishedPages();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ "error": "Status 500: error in fecth pages" });
  }
});

// Get all created pages
app.get('/api/pages/created', isLoggedIn, async (req, res) => {
  try {
    const pages = await db_pages_queries.getAllCreatedPages();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ "error": "Status 500: error in fecth pages" });
  }
});

// Get page content
app.get('/api/pages/:id', async (req, res) => {
  try {
    const page = await db_pages_queries.getPageDataById(req.params.id, req.user);
    res.json(page);
  } catch (err) {
    if (err === 0) {
      res.status(404).json({ "error": "Status 404: page not found" });
    } else if (err === 1) {
      res.status(401).json({ "error": "Status 401: unauthorized" });
    } else {
      console.log(err)
      res.status(500).json({ "error": "Status 500: error in fecth page data" });
    }
  }
});

// Add new page
app.post('/api/pages/add', isLoggedIn, [
  check('title').isLength({ min: 1 }),
  check('publication_date').custom(custom_validator.isCorrectPublicationDate),
  check('content').custom(custom_validator.isCorrectContent)
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ "errors": errors.array() });
  }

  try {
    const new_page = {
      author_name: req.user.name,
      title: req.body.title,
      publication_date: req.body.publication_date
    }

    const new_id = await db_pages_queries.addNewPage(new_page, req.user.id, req.body.content);
    res.status(201).json(new_id);
  } catch (err) {
    console.log(err)
    res.status(500).json({ "error": "Status 500: error in adding page" });
  }
});

// Update a page
app.put('/api/pages/:id', isLoggedIn, [
  check('title').isLength({ min: 1 }),
  check('author_id').isInt(),
  check('publication_date').custom(custom_validator.isCorrectPublicationDate),
  check('content').custom(custom_validator.isCorrectContent)
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ "errors": errors.array() });
  }

  try {
    const new_page = {
      id: req.params.id,
      author_id: req.body.author_id,
      title: req.body.title,
      publication_date: req.body.publication_date
    }

    const rows_changed = await db_pages_queries.updatePage(new_page, req.user.id, req.user.admin, req.body.content);
    res.json(rows_changed);
  } catch (err) {
    if (err === 0) {
      res.status(422).json({ "error": "Status 404: user not found" });
    } else if (err === 1) {
      res.status(404).json({ "error": "Status 404: page not found" });
    }else if (err === 2) {
      res.status(403).json({ "error": "Status 403: not enough requirements" });
    } else {
      res.status(500).json({ "error": "Status 500: error in updating page" });
    }
  }
});

// Delete a page
app.delete('/api/pages/delete/:id', isLoggedIn, async (req, res) => {
  try {
    const rows_deleted = await db_pages_queries.deletePage(req.params.id, req.user.id, req.user.admin);
    res.json(rows_deleted);
  } catch (err) {
    if (err === 0) {
      res.status(404).json({ "error": "Status 404: page not found" });
    } else if (err === 1) {
      res.status(403).json({ "error": "Status 403: not enough requirements" });
    } else {
      res.status(500).json({ "error": "Status 500: error in deleting page" });
    }
  }
});

////////////////////////
// API for users
////////////////////////

// Login
app.post('/api/sessions', [
  check('username').isEmail(),
  check('password').isLength({ min: 3 })
], (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json(info);
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.json(req.user);
    });
  })(req, res, next);
});

// Check whether the user is logged in or not
app.get('/api/sessions/current', isLoggedIn, (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: "Unauthenticated user!" });
  }
});

// Logout
app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
  req.logOut(() => res.end());
});

// Get all users
app.get('/api/users', isAdmin, async (req, res) => {
  try {
    const users = await db_user_queries.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ "error": "Status 500: error in fecth users" });
  }
});

////////////////////////
// Other instruction
////////////////////////

// Activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
