const router = require('express').Router();
// Import the User model from the models folder
const {
  ActionableGoal,
  HabitualGoal,
  ActionableGoalEntry,
  HabitualGoalEntry,
} = require('../models');

// Import withAuth to check if user already logged in
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
  if (req.session.logged_in) {
    return res.redirect('/dashboard-goals');
  }

  return res.render('homepage');
});

router.get('/dashboard-goals', withAuth, async (req, res) => {
  //Actionable
  let actionableGoals = await ActionableGoal.findAll({
    include: [
      {
        model: ActionableGoalEntry,
        attributes: ['id', 'quantity', 'notes', 'date_created'],
      },
    ],
    where: {
      user_id: req.session.user_id,
      // user_id: 1
    },
  });

  actionableGoals = await Promise.all(actionableGoals.map(async (goal) => {
    const progress = await goal.goalProgress(); 
    const goalPlain = goal.get({ plain: true });
    goalPlain.progress = progress; // Assign the calculated progress
    console.log(goalPlain.progress); 
    return goalPlain; 
  }));
  
  console.log(actionableGoals)
  //Habitual
  let habitualGoals = await HabitualGoal.findAll({
    include: [
      {
        model: HabitualGoalEntry,
        attributes: ['id', 'notes', 'date_created'],
      },
    ],
    where: {
      user_id: req.session.user_id,
      // user_id: 1
    },
  });

  habitualGoals = await Promise.all(habitualGoals.map(async (goal) => {
    const progress = await goal.goalProgress(); 
    const goalPlain = goal.get({ plain: true }); 
    goalPlain.progress = progress; // Assign the calculated progress
    return goalPlain; // Return the modified plain object
  }));

  const goals = [...actionableGoals, ...habitualGoals];
  console.log("Goals:")
  console.log(goals)
  res.render('dashboard-goals', {
    layout: 'alternative',
    goals,
  });
});

router.get('/login', async (req, res) => {
  // If the user is already logged in, redirect the request to dashboard-goals
  if (req.session.logged_in) {
    res.redirect('/dashboard-goals');
    return;
  }
  res.render('login');
});

router.get('/signup', async (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard-goals');
    return;
  }
  res.render('signup');
});

router.get('/goals/new', withAuth, async (req, res) => {
  res.render('new-goal', {
    layout: 'alternative',
  });
});

router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect the request to dashboard-goals
    if (req.session.logged_in) {
      res.redirect('/dashboard-goals');
      return;
    }
  
    res.render('signup');
  });

module.exports = router;
