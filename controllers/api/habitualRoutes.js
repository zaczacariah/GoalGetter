const router = require('express').Router();
// Import the User model from the models folder
const { HabitualGoal, HabitualGoalEntry } = require('../../models');


//Ben GET

router.get('/', async (req, res) => {
    try {
        
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

        if(!habitualGoals){
            res.status(404).json({ message: "No Actionable Goals Found"})
            return;
        }

        res.status(200).json(habitualGoals);


    } catch (error) {
        res.json(error)
    }
});

router.get('/:id', async (req, res) => {
    try {
        
        const goal = await HabitualGoal.findByPk(req.params.id, {
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

        if(!goal){
            return res.status(404).json({ message: "No Habitual Goal Found"});
           
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

    const updatedGoal = await HabitualGoal.update({
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

});



//Dinh Post: req.body should be like below
    // {
    //     "name": "Read 20 Books This Year",
    //     "description": "Complete reading 20 different books to broaden knowledge and perspectives.",
    //     "goal_amount": 20,
    //     "due_date": "2025-12-31"
    // }
router.post('/', async (req, res) => {
    // check if there is valid req
    const {name, description, goal_amount, due_date} = req.body;
    if (!name && !description && !goal_amount && !due_date) {
        res.status(400).json({message: "No data to create goal!"});
        return;
    };

    try {
        const newHabitualGoal = await HabitualGoal.create(req.body);
        res.status(200).json(newHabitualGoal);            
    
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
        const deletedHabitualGoal = await HabitualGoal.destroy({
            where: {
                id: req.params.id
            }
        });

        // check if the goal is not found to delete
        if (!deletedHabitualGoal) {
            res.status(404).json({ message: 'No goal found with this id!' });
            return;
        };
        res.status(200).json(deletedHabitualGoal);            

    } catch (error) {
        res.status(500).json(error);
    };
});


module.exports = router;