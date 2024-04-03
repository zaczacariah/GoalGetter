const router = require('express').Router();
// Import the User model from the models folder
const { User } = require('../../models');

// Import validator from module
var validator = require('validator');

// If a POST request is made to /api/user, a new user is created. The user id and logged in state is saved to the session within the request object.
router.post('/', async (req, res) => {
  const user = {};
  // check if username is a valid email.
  if (!validator.isEmail(req.body.username)) {
    res.statusMessage = 'Please input valid email.';
    res.status(400).end();
    return;
  } else {
    user['email'] = req.body.username;
  }

  // check if password is strong
  if (
    !validator.isStrongPassword(req.body.password, {
      minLength: 8,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    res.statusMessage =
      'The password should have at least 8 characters including number.';
    res.status(400).end();
    return;
  } else {
    user['password'] = req.body.password;
  }

  // check if name is not empty
  if (validator.isEmpty(req.body.name)) {
    res.statusMessage = 'The name should not be empty.';
    res.status(400).end();
    return;
  } else {
    user['name'] = req.body.name;
  }

  try {
    const userData = await User.create(user);

    // automatic login after creating the account.
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// If a POST request is made to /api/users/login, the function checks to see if the user information matches the information in the database and logs the user in. If correct, the user ID and logged-in state are saved to the session within the request object.
router.post('/login', async (req, res) => {
  console.log(req.body.email);
  if (!validator.isEmail(req.body.email)) {
    res.status(400).json({ message: 'Please input valid email.' });
    return;
  }
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// If a POST request is made to /api/user/logout, the function checks the logged_in state in the request.session object and destroys that session if logged_in is true.
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
