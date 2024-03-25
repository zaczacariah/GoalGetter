const router = require('express').Router();
// Import the User model from the models folder
const { ActionableGoal, ActionableGoalEntry } = require('../../models');


//Ben GET

//Ben PUT

//Dinh Post: req.body should be like below
// {
//     "name": "Save Money for Vacation",
//     "unit": "$",
//     "direction": "ASC",
//     "description": "Save enough money to go on a vacation to Hawaii.",
//     "goal_amount": 2000,
//     "due_date": "2024-06-01",
//     "date_created": "2023-01-01"
// }
router.post('/', async (req, res) => {
    try {
        // check if req.body is not empty
        if (req.body) {
            const newActionableGoal = await ActionableGoal.create(req.body);
            res.status(200).json(newActionableGoal);            
        } else {
            res.status(400).json({ message: 'request error!' });
        };
        
    } catch (error) {
        res.status(500).json(error);
    };
});

//Dinh Delete
router.delete('/:id', async (req, res) => {
    try {
        // check if there is an id
        if (req.params.id) {
            const deletedActionableGoal = await ActionableGoal.destroy({
                where: {
                    id: req.params.id
                }
            });

            // check if the goal is not found to delete
            if (!deletedActionableGoal) {
                res.status(404).json({ message: 'No goal found with this id!' });
                return;
            };
            res.status(200).json(deletedActionableGoal);            
        } else {
            res.status(404).json({ message: 'No goal found with this id!' });
        };
    } catch (error) {
        res.status(500).json(error);
    };
});


module.exports = router;