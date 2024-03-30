const router = require('express').Router();
// Import the User model from the models folder
const { ActionableGoal, ActionableGoalEntry } = require('../../models');


//Ben GET

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
            ],
            where: {
                user_id: req.session.user_id
            }
        });

        if(!actionableGoals){
            res.status(404).json({ message: "No Actionable Goals Found"})
            return;
        }

        res.status(200).json(actionableGoals);


    } catch (error) {
        res.json(error)
    }
});

router.get('/:id', async (req, res) => {
    try {
        
        const goal = await ActionableGoal.findOne({
            where: {
                id: req.params.id, // Primary key filter
                user_id: req.session.user_id // Additional filtering condition
            },
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

        if(!goal){
            return res.status(404).json({ message: "No Actionable Goal Found"});
           
        }

        res.status(200).json(goal);

    } catch (error) {
        res.json(error)
    }
});



//Ben PUT
router.put('/:id', async (req, res) => {
    const { name, notes, description, due_date, goal_amount } = req.body;

    if(!name && !notes && !description && !due_date && !goal_amount){
        return res.status(400).json( { message: "No Data to update" });
    }

    //check date format
    if(due_date){
        const date = new Date(due_date);
        if (isNaN(date.getTime())) {
            return res.status(400).send({ error: 'Invalid date format. We require ISO 8601 format.' });
        }
    }

    // Check if the goal exists and belongs to the user
    const goal = await ActionableGoal.findOne({
    where: {
        id: req.params.id,
        user_id: req.session.user_id
    }
    });

    if (!goal) {
    return res.status(404).send('No goal found with the provided id for the current user.');
    }

    const updatedGoal = await ActionableGoal.update({
        name,
        notes,
        description,
        due_date,
        goal_amount
    },
    {
        where: {
            id: req.params.id,
            user_id: req.session.user_id
        }
    });


    return res.status(202).send("Goal Succesfully Updated");

});



//Dinh Post: req.body should be like below
// {
//     "name": "Save Money for Vacation",
//     "unit": "$",
//     "direction": "ASC",
//     "description": "Save enough money to go on a vacation to Hawaii.",
//     "goal_amount": 2000,
//     "due_date": "2024-06-01",
// }
router.post('/', async (req, res) => {
    // check if there is valid req
    const { name, unit, direction, description, goal_amount, due_date } = req.body;
    if (!name || !unit || !direction || !description || !goal_amount || !due_date) {
        res.status(400).json({ message: "No data to create goal"});
        return;
    };

    try {
        const newActionableGoal = await ActionableGoal.create({
            ...req.body,
            user_id: req.session.user_id
        });
        res.status(200).json(newActionableGoal);
    } catch (error) {
        res.status(500).json(error);
    };
});


//Dinh Delete
router.delete('/:id', async (req, res) => {
    // check if id is a number
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).json({ message: "id not an Int"});
    };

    try {
        
        const deletedActionableGoal = await ActionableGoal.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });

        // check if the goal is not found to delete
        if (!deletedActionableGoal) {
            res.status(404).json({ message: 'No goal found with this id!' });
            return;
        };
        res.status(200).json(deletedActionableGoal);            
    
    } catch (error) {
        res.status(500).json(error);
    };
});


module.exports = router;