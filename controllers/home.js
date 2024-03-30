const router = require('express').Router();
// Import the User model from the models folder
const { Project, User, ActionableGoal, HabitualGoal, ActionableGoalEntry, HabitualGoalEntry} = require('../models');

router.get('/dashboard-goals', async (req, res) => {

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
    // const projectsData = await Project.findAll({
    //     include: [
    //         {
    //             model: User,
    //             attributes: [
    //                 "name"
    //             ]            
    //         }
    //     ]
    // });

    // if(!projectsData){
    //     res.status(404).json();

    // }
    // const projects = projectsData.map((project) => project.get({plain:true}));

    res.render('login');
})

module.exports = router;
