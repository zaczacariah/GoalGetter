const router = require('express').Router();
// Import the User model from the models folder
const { ActionableGoal, ActionableGoalEntry } = require('../../models');


//Ben PUT
router.put('/:id', async (req, res) => {
    const { quantity, notes } = req.body;

    if(!quantity && !notes){
        return res.status(400).json( { message: "No Data to update" });
    }

    try{

        const updatedEntry = await ActionableGoalEntry.update({
            quantity,
            notes
        },
        {
            where: {
                id: req.params.id
            }
        });


        return res.status(202).json(updatedEntry);
    } catch (error) {
        return res.status(500).json(error);
    }

});


// Actionable Entry Schema
// {
//     "quantity": 2,
//     "notes": "Lost 2 Kg this week with healthy eating and more exercise.",
//     "actionable_goal_id": 2
// }
router.post('/', async (req, res) => {

    const { quantity, notes, actionable_goal_id } = req.body;

    try {
        // check if req.body is not empty
        if ( quantity && notes && actionable_goal_id ) {
            const newActionableEntry = await ActionableGoalEntry.create(req.body);
            res.status(200).json(newActionableEntry);            
        } else {
            res.status(400).json({ message: 'Actionable Goal Entries require the following properties: quantity, notes and actionable_goal_id' });
        };
        
    } catch (error) {
        res.status(500).json(error);
    };
});


router.delete('/:id', async (req, res) => {

    // Check ID is an INTEGER
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).json({ message: "ID not an INTEGER"});
    }

    try {

        const deletedActionableEntry = await ActionableGoalEntry.destroy({
            where: {
                id: req.params.id
            }
        });

        // check if the goal is not found to delete
        if (!deletedActionableEntry) {
            return res.status(404).json({ message: 'No Entry found with this id!' });
            
        };

        res.status(200).json(deletedActionableEntry);            
        
    } catch (error) {
        res.status(500).json(error);
    };
});


module.exports = router;