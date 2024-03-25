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
            ]
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
        
        const goal = await ActionableGoal.findByPk(req.params.id, {
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

    const updatedGoal = await ActionableGoal.update({
        name,
        notes,
        description,
        due_date,
        goal_amount
    },
    {
        where: {
            id: req.params.id
        }
    });


    return res.status(202).json(updatedGoal);


})
//Dinh Post


//Dinh Delete



module.exports = router;