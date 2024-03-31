const router = require('express').Router();
// Import the models from the models folder
const { HabitualGoalEntry, HabitualGoal} = require('../../models');

// Import validator from module
var validator = require('validator');

// update an entry by its id
// req.body looks like below:
// {
//     "notes": "Read 'The Alchemist' by Paulo Coelho.",
//     "habitual_goal_id": 1 
// }
router.put('/:id', async (req, res) => {
 
    const { notes, habitual_goal_id } = req.body;

    if (!notes && !habitual_goal_id) {
        return res.status(400).json({ message: "No Data to update" });
    };

    try {

         //Checking if there is an HG Entry that belongs to this user
        const entry = await HabitualGoalEntry.findByPk(req.params.id, {
            include: [{
                model: HabitualGoal,
                attributes: [],
                where: { user_id: req.session.user_id }
            }]
            });

        if (!entry) {
            return res.status(404).send("You do not have an Habitual Goal Entry with this ID");
        }


        await HabitualGoalEntry.update(req.body,
        {
            where: {
                id: req.params.id
            }
        });

        return res.status(202).send("Habitual Goal Entry Updated!");
    }
    catch (error) {
        return res.status(500).json(error);
    };

});


// post an entry
// req.body looks like below:
// {
//     "notes": "Read 'The Alchemist' by Paulo Coelho.",
//     "habitual_goal_id": 1 
// }
router.post('/', async (req, res) => {

    // check if req.body is not empty
    const { notes, habitual_goal_id } = req.body;

    if ( validator.isEmpty(notes) || !validator.isNumeric(habitual_goal_id) ) {
        return res.status(400).send("No Data to post");
    };
    
    try {
                
        // Check if the goal exists and belongs to the user
        const goal = await HabitualGoal.findOne({
            where: {
                id: habitual_goal_id,
                user_id: req.session.user_id
            }
        });

        if (!goal) {
            return res.status(404).send('No goal found with the provided id for the current user.');
        }

        const newHabitualGoalEntry = await HabitualGoalEntry.create(req.body);
        res.status(200).json(newHabitualGoalEntry);

    } catch (error) {
        res.status(500).json(error);
    };
});

// delete an entry by its id
router.delete('/:id', async (req, res) => {

    // Check if id is an INTEGER
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).send("ID not an INTEGER");
    };

    try {
                
        // Check if the goal exists and belongs to the user
         //Checking if there is an HG Entry that belongs to this user
         const entry = await HabitualGoalEntry.findByPk(req.params.id, {
            include: [{
                model: HabitualGoal,
                attributes: [],
                where: { user_id: req.session.user_id }
            }]
            });

        if (!entry) {
            return res.status(404).send("You do not have an Habitual Goal Entry with this ID");
        }

        await HabitualGoalEntry.destroy({
            where: {
                id: req.params.id
            }
        });

        res.status(200).send("Succesfully Deleted");

    } catch (error) {
        res.status(500).json(error); 
    };
});

module.exports = router;