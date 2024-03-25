const router = require('express').Router();
// Import the User model from the models folder
const { ActionableGoal, ActionableGoalEntry, HabitualGoal, HabitualGoalEntry } = require('../../models');

router.get('/', async (req, res) => {
    try {
        
        const actionableGoals = await ActionableGoal.findAll({
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
            ]
        });

        const habitualGoals = await HabitualGoal.findAll({
            include: [
                {
                    model: HabitualGoalEntry,
                    attributes: [
                        "id",
                        "notes",
                        "date_created"
                    ]
                }
            ]
        });


        const allGoals = { actionableGoals, habitualGoals};

        res.status(200).json(allGoals);


    } catch (error) {
        res.json(error)
    }
})


module.exports = router;
