const router = require('express').Router();
// Import the models from the models folder
const { HabitualGoalEntry} = require('../../models');

// post an entry
// req.body looks like below:
// {
//     "notes": "Read 'The Alchemist' by Paulo Coelho.",
//     "habitual_goal_id": 1 
// }
router.post('/', async (req, res) => {

    // check if req.body is not empty
    const { notes, habitual_goal_id } = req.body;
    if (!notes && !habitual_goal_id) {
        res.status(400).json({ message: "No Data to post" });
        return;
    };
    
    try {
        const newHabitualGoalEntry = await HabitualGoalEntry.create(req.body);
        res.status(200).json(newHabitualGoalEntry);
    } catch (error) {
        res.status(500).json(error);
    };
});

// update an entry by its id
router.put('/:id', async (req, res) => {
    // req.body looks like below:
    // {
    //     "notes": "Read 'The Alchemist' by Paulo Coelho.",
    //     "habitual_goal_id": 1 
    // }

    const { notes, habitual_goal_id } = req.body;

    if (!notes && !habitual_goal_id) {
        return res.status(400).json({ message: "No Data to update" });
    };

    try {
        const updatedEntry = await HabitualGoalEntry.update(req.body,
        {
            where: {
                id: req.params.id
            }
        });
    }
    catch (error) {
        return res.status(500).json(error);
    };

});

// delete an entry by its id
router.delete('/:id', async (req, res) => {

    // Check if id is an INTEGER
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).json({ message: "ID not an INTEGER"});
    };

    try {

        const deletedHabitualGoalEntry = await HabitualGoalEntry.destroy({
            where: {
                id: req.params.id
            }
        });

        //check if the entry is not found to delete
        if (!deletedHabitualGoalEntry) {
            res.status(404).json({ message: "No Entry Found with that ID" });
            return;
        };

        res.status(200).json(deletedHabitualGoalEntry);
    } catch (error) {
        res.status(500).json(error); 
    };
});

module.exports = router;