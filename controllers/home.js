const router = require('express').Router();
// Import the User model from the models folder
const { Project, User, ActionableGoal, HabitualGoal, ActionableGoalEntry, HabitualGoalEntry} = require('../models');

// Import withAuth to check if user already loggein
const withAuth = require('../utils/auth');


router.get('/dashboard-goals', withAuth, async (req, res) => {

    //Actionable
    let actionableGoals = await ActionableGoal.findAll({
        include: [
            {
                model: ActionableGoalEntry,
                attributes: [
                    "id",
                    "quantity",
                    "notes",
                    "date_created"

                ]
            }
        ],
        where: {
            user_id: req.session.user_id
            // user_id: 1
        }
    });

    actionableGoals = actionableGoals.map((goal) => goal.get({plain:true}))

    //Habitual
    let habitualGoals = await HabitualGoal.findAll({
        include: [
            {
                model: HabitualGoalEntry,
                attributes: [
                    "id",
                    "notes",
                    "date_created" 
                ]
            }
        ],
        where: {
            user_id: req.session.user_id
            // user_id: 1
        }
    });

    habitualGoals = habitualGoals.map((goal)=> goal.get({plain:true}))

    const goals = [...actionableGoals, ...habitualGoals];


    
    console.log(goals);

    res.render('dashboard-goals', {
        layout: 'alternative',
        goals
    });
});

router.get('/login', async (req, res) => {
   // If the user is already logged in, redirect the request to dashboard-goals
  if (req.session.logged_in) {
    res.redirect('/dashboard-goals');
    return;
  }
    res.render('login');
})

router.get('/signup', async (req, res) => {
  // If the user is already logged in, redirect the request to dashboard-goals
  if (req.session.logged_in) {
    res.redirect('/dashboard-goals');
    return;
  }
  res.render('signup');
});

module.exports = router;
